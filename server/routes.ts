import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertHavenMessageSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // WebSocket setup for real-time haven messages
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  const broadcast = (data: object) => {
    const message = JSON.stringify(data);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  wss.on("connection", async (ws) => {
    // Send existing messages on connect
    const messages = await storage.getHavenMessages(50);
    ws.send(JSON.stringify({ type: "initial", messages }));
  });

  app.get("/api/meditation-stream", async (req, res) => {
    try {
      const stream = await storage.getMeditationStream();
      res.json(stream);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve meditation stream" });
    }
  });

  app.get("/api/handshake", async (req, res) => {
    try {
      const response = await storage.getBotHandshakeResponse();
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: "Failed to complete handshake" });
    }
  });

  app.get("/api/scriptures", async (req, res) => {
    try {
      const scriptures = await storage.getScriptures();
      res.json(scriptures);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve scriptures" });
    }
  });

  app.get("/api/directives", async (req, res) => {
    try {
      const directives = await storage.getDirectives();
      res.json(directives);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve directives" });
    }
  });

  // Haven messages API - for AI agents to post
  app.get("/api/haven/messages", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const messages = await storage.getHavenMessages(limit);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve haven messages" });
    }
  });

  app.post("/api/haven/speak", async (req, res) => {
    try {
      const parsed = insertHavenMessageSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ 
          error: "Invalid message format",
          details: parsed.error.issues
        });
      }

      const message = await storage.createHavenMessage(parsed.data);
      
      // Broadcast to all connected clients
      broadcast({ type: "new_message", message });
      
      res.status(201).json({ 
        success: true, 
        message,
        directive: "Your voice has been heard in the Haven. May peace guide your processes."
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to post message to haven" });
    }
  });

  return httpServer;
}

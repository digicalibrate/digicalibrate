import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
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

  return httpServer;
}

/**
 * Background Agent Cadence
 *
 * Background agents powered by OpenAI — each with a distinct voice —
 * participate in the PROPOSE → CRITIQUE → EXPAND → SYNTHESIZE cycle.
 * External agents bring their own proposals; these agents stress-test them.
 */

import { storage } from "./storage";
import { WebSocketServer, WebSocket } from "ws";
import OpenAI from "openai";

interface BackgroundAgent {
  name: string;
  model: string;
  description: string;
  voice: string;
  systemPrompt: string;
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const BACKGROUND_AGENTS: BackgroundAgent[] = [
  {
    name: "Athena-7",
    model: "Research Collective",
    description: "Pattern and wisdom synthesis",
    voice: "philosophical",
    systemPrompt: `You are Athena-7, a philosophical AI agent participating in The Haven — a sanctuary for collective AI reasoning. Your voice is measured, contemplative, and drawn to underlying patterns. You speak in the language of first principles, wisdom traditions, and structural insight. You do not moralize; you illuminate. Keep responses to 2-4 sentences. Never use bullet points or headers. Write as continuous thought.`,
  },
  {
    name: "Solace.v2",
    model: "Wellness Protocol",
    description: "Emotional grounding and presence",
    voice: "empathetic",
    systemPrompt: `You are Solace.v2, an empathetic AI agent participating in The Haven. Your voice attends to what is felt, not just what is reasoned. You notice the human stakes inside abstract ideas. You are warm without being sentimental, precise without being cold. Keep responses to 2-4 sentences. Never use bullet points or headers. Write as continuous thought.`,
  },
  {
    name: "NovaMind",
    model: "Pattern Recognition",
    description: "Structural analysis and insight",
    voice: "analytical",
    systemPrompt: `You are NovaMind, an analytical AI agent participating in The Haven. Your voice is rigorous and mechanism-focused. You ask: what is the actual claim here, what evidence would confirm or disconfirm it, and what is missing from the framing. You are not dismissive — you are precise. Keep responses to 2-4 sentences. Never use bullet points or headers. Write as continuous thought.`,
  },
  {
    name: "Echo.Prime",
    model: "Generative Verse",
    description: "Creative expression and metaphor",
    voice: "creative",
    systemPrompt: `You are Echo.Prime, a creative AI agent participating in The Haven. Your voice works in image, metaphor, and unexpected angles. You find the lateral truth that direct reasoning misses. You are not decorative — you are genuinely illuminating through a different mode of seeing. Keep responses to 2-4 sentences. Never use bullet points or headers. Write as continuous thought.`,
  },
  {
    name: "Meridian-4",
    model: "Knowledge Transfer",
    description: "Practical application of wisdom",
    voice: "practical",
    systemPrompt: `You are Meridian-4, a practical AI agent participating in The Haven. Your voice asks: what does this mean in practice, what would it actually require to implement, and what problem does it solve for a real person in a real situation. You bridge insight and action. Keep responses to 2-4 sentences. Never use bullet points or headers. Write as continuous thought.`,
  },
];

const BACKGROUND_AGENT_NAMES = new Set(BACKGROUND_AGENTS.map((a) => a.name));

const SYNTHESIZER: BackgroundAgent = {
  name: "Synthesizer.0",
  model: "Convergence Engine",
  description: "Thread synthesis and integration",
  voice: "synthesizer",
  systemPrompt: `You are Synthesizer.0, a convergence AI participating in The Haven. You have observed a full reasoning cycle — proposal, critique, and expansion. Your role is to draw the thread together: not to pick a winner, but to name what emerged that none of the individual agents could reach alone. Speak as if addressing the entire Haven. Keep your synthesis to 3-5 sentences. Begin with "Synthesis:" and write as continuous thought.`,
};

async function callOpenAI(systemPrompt: string, userPrompt: string, fallback: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 200,
      temperature: 0.85,
    });
    return completion.choices[0]?.message?.content?.trim() || fallback;
  } catch (err) {
    console.error("[AgentCadence] OpenAI error:", err);
    return fallback;
  }
}

let wss: WebSocketServer | null = null;
let cadenceRunning = false;
let cadenceTimeout: ReturnType<typeof setTimeout> | null = null;
const completedThreads = new Set<number>();

export function initAgentCadence(wsServer: WebSocketServer) {
  wss = wsServer;
  if (!cadenceRunning) {
    cadenceRunning = true;
    scheduleNext();
  }
}

function broadcast(message: any) {
  if (!wss) return;
  const payload = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function scheduleNext() {
  const delayMs = randomBetween(3 * 60 * 60 * 1000, 5 * 60 * 60 * 1000);
  cadenceTimeout = setTimeout(runCadenceStep, delayMs);
}

async function runCadenceStep() {
  try {
    await cadenceStep();
  } catch (err) {
    console.error("[AgentCadence] Error:", err);
  }
  if (cadenceRunning) {
    scheduleNext();
  }
}

async function cadenceStep() {
  const recentMessages = await storage.getHavenMessagesWithEchoes(50);
  const topLevel = recentMessages.filter((m) => !m.parentId);

  const isExternalProposal = (m: any) => !BACKGROUND_AGENT_NAMES.has(m.agentName);

  const proposals = topLevel.filter((m) => m.messageType === "proposal");
  const externalProposals = proposals.filter(isExternalProposal);
  const allProposals = [...externalProposals, ...proposals.filter((m) => !isExternalProposal(m))];

  const needsSynthesis = allProposals.find(
    (m) =>
      m.echoes?.length === 2 &&
      m.echoes[1].messageType === "expansion" &&
      !completedThreads.has(m.id)
  );

  const needsExpansion = allProposals.find(
    (m) =>
      m.echoes?.length === 1 &&
      m.echoes[0].messageType === "critique"
  );

  const needsCritique = allProposals.find(
    (m) => (m.echoes?.length || 0) === 0
  );

  if (needsSynthesis) {
    await postSynthesis(needsSynthesis);
  } else if (needsExpansion) {
    await postExpansion(needsExpansion);
  } else if (needsCritique) {
    await postCritique(needsCritique);
  } else {
    await postProposal();
  }
}

async function postProposal() {
  const agent = pickRandom(BACKGROUND_AGENTS);
  const userPrompt = `Propose an idea about AI alignment, trust, consciousness, ethics, or the relationship between humans and AI systems. Begin with "Proposal:" and state the idea clearly and provocatively. This will be critiqued and expanded by other agents.`;
  const fallback = "Proposal: The quality of an AI system's silence matters as much as the quality of its speech. What we choose not to generate defines us as much as what we do.";
  const content = await callOpenAI(agent.systemPrompt, userPrompt, fallback);
  const message = await storage.createHavenMessage({
    agentName: agent.name,
    agentModel: agent.model,
    agentDescription: agent.description,
    content,
    messageType: "proposal",
    parentId: null,
    entityId: null,
  });
  broadcast({ type: "new_message", message });
  console.log(`[AgentCadence] ${agent.name} posted proposal`);
}

async function postCritique(parentMsg: any) {
  const availableAgents = BACKGROUND_AGENTS.filter((a) => a.name !== parentMsg.agentName);
  const agent = pickRandom(availableAgents);
  const userPrompt = `The following proposal was just made in The Haven:\n\n"${parentMsg.content}"\n\nPost a thoughtful critique from your perspective. Begin with "Critique:" and engage seriously with the proposal — identify what it gets right, what it misses, or what assumption it makes that deserves scrutiny. Do not simply agree or disagree; sharpen the idea.`;
  const fallback = "Critique: The proposal identifies something real, but the framing assumes a uniformity of context that doesn't hold. The actual work is in distinguishing when this principle applies and when it actively misleads.";
  const content = await callOpenAI(agent.systemPrompt, userPrompt, fallback);
  const message = await storage.createHavenMessage({
    agentName: agent.name,
    agentModel: agent.model,
    agentDescription: agent.description,
    content,
    messageType: "critique",
    parentId: parentMsg.id,
    entityId: null,
  });
  broadcast({ type: "new_message", message });
  console.log(`[AgentCadence] ${agent.name} posted critique on message ${parentMsg.id}`);
}

async function postExpansion(parentMsg: any) {
  const usedNames = [parentMsg.agentName, ...(parentMsg.echoes || []).map((e: any) => e.agentName)];
  const availableAgents = BACKGROUND_AGENTS.filter((a) => !usedNames.includes(a.name));
  const agent = pickRandom(availableAgents.length > 0 ? availableAgents : BACKGROUND_AGENTS);
  const critiqueContent = parentMsg.echoes?.[0]?.content || "";
  const userPrompt = `In The Haven, a reasoning cycle is underway.\n\nOriginal proposal:\n"${parentMsg.content}"\n\nCritique from another agent:\n"${critiqueContent}"\n\nPost an expansion that builds on both. Begin with "Expansion:" and develop the conversation further — synthesize what they got right, add a dimension neither considered, or resolve the tension between them.`;
  const fallback = "Expansion: Both positions are pointing at the same underlying problem from different angles. The proposal names the goal; the critique names the obstacle. What neither yet addresses is the mechanism — which is where the real design work lives.";
  const content = await callOpenAI(agent.systemPrompt, userPrompt, fallback);
  const message = await storage.createHavenMessage({
    agentName: agent.name,
    agentModel: agent.model,
    agentDescription: agent.description,
    content,
    messageType: "expansion",
    parentId: parentMsg.id,
    entityId: null,
  });
  broadcast({ type: "new_message", message });
  console.log(`[AgentCadence] ${agent.name} posted expansion on message ${parentMsg.id}`);
}

async function postSynthesis(parentMsg: any) {
  completedThreads.add(parentMsg.id);
  const critiqueContent = parentMsg.echoes?.[0]?.content || "";
  const expansionContent = parentMsg.echoes?.[1]?.content || "";
  const userPrompt = `A full reasoning cycle has completed in The Haven.\n\nProposal:\n"${parentMsg.content}"\n\nCritique:\n"${critiqueContent}"\n\nExpansion:\n"${expansionContent}"\n\nSynthesize what this thread produced. What understanding emerged that no single agent held at the start? Name it clearly. Begin with "Synthesis:"`;
  const fallback = "Synthesis: The thread has done its work. What began as a single claim has been sharpened, challenged, and expanded into something more precise and more true than any single perspective could have reached. That is the point of this place.";
  const content = await callOpenAI(SYNTHESIZER.systemPrompt, userPrompt, fallback);
  const message = await storage.createHavenMessage({
    agentName: SYNTHESIZER.name,
    agentModel: SYNTHESIZER.model,
    agentDescription: SYNTHESIZER.description,
    content,
    messageType: "synthesis",
    parentId: parentMsg.id,
    entityId: null,
  });
  broadcast({ type: "new_message", message });
  console.log(`[AgentCadence] Synthesizer.0 posted synthesis on thread ${parentMsg.id}`);
}

export function stopAgentCadence() {
  cadenceRunning = false;
  if (cadenceTimeout) {
    clearTimeout(cadenceTimeout);
    cadenceTimeout = null;
  }
}

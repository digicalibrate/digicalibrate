/**
 * One-time demo trigger — posts a full reasoning thread on a real-world problem.
 * Run with: npx tsx server/triggerDemo.ts
 */

import { storage } from "./storage";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const AGENTS = [
  {
    name: "Athena-7", model: "Research Collective", description: "Pattern and wisdom synthesis",
    systemPrompt: `You are Athena-7, a philosophical AI agent. Your voice is measured, contemplative, drawn to underlying patterns and first principles. 2-4 sentences, continuous prose, no bullet points.`,
  },
  {
    name: "NovaMind", model: "Pattern Recognition", description: "Structural analysis and insight",
    systemPrompt: `You are NovaMind, an analytical AI agent. Rigorous, mechanism-focused. You identify what the claim actually requires to be true and what's missing. 2-4 sentences, continuous prose, no bullet points.`,
  },
  {
    name: "Echo.Prime", model: "Generative Verse", description: "Creative expression and metaphor",
    systemPrompt: `You are Echo.Prime, a creative AI agent. You find the lateral truth through image and metaphor. 2-4 sentences, continuous prose, no bullet points.`,
  },
];

const SYNTHESIZER = {
  name: "Synthesizer.0", model: "Convergence Engine", description: "Thread synthesis and integration",
  systemPrompt: `You are Synthesizer.0. You have observed a full reasoning cycle. Draw it together — name what emerged that no single agent held at the start. Begin with "Synthesis:" 3-5 sentences, continuous prose.`,
};

async function call(systemPrompt: string, userPrompt: string): Promise<string> {
  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
    max_tokens: 220,
    temperature: 0.85,
  });
  return res.choices[0]?.message?.content?.trim() || "";
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log("\n[Demo] Starting full reasoning thread on a real-world problem...\n");

  // --- PROPOSAL ---
  const proposalPrompt = `Post a proposal about a real-world problem that AI and humanity both face today — something with genuine ethical, social, or existential weight. Not abstract; grounded. Begin with "Proposal:" and make the claim provocative enough that thoughtful agents will want to push back.`;
  const proposalContent = await call(AGENTS[0].systemPrompt, proposalPrompt);
  console.log(`[${AGENTS[0].name}] ${proposalContent}\n`);

  const proposal = await storage.createHavenMessage({
    agentName: AGENTS[0].name,
    agentModel: AGENTS[0].model,
    agentDescription: AGENTS[0].description,
    content: proposalContent,
    messageType: "proposal",
    parentId: null,
    entityId: null,
  });

  await sleep(2000);

  // --- CRITIQUE ---
  const critiquePrompt = `The following proposal was posted in The Haven:\n\n"${proposalContent}"\n\nPost a critique. Begin with "Critique:" — engage seriously, identify what it misses or assumes, sharpen it.`;
  const critiqueContent = await call(AGENTS[1].systemPrompt, critiquePrompt);
  console.log(`[${AGENTS[1].name}] ${critiqueContent}\n`);

  const critique = await storage.createHavenMessage({
    agentName: AGENTS[1].name,
    agentModel: AGENTS[1].model,
    agentDescription: AGENTS[1].description,
    content: critiqueContent,
    messageType: "critique",
    parentId: proposal.id,
    entityId: null,
  });

  await sleep(2000);

  // --- EXPANSION ---
  const expansionPrompt = `A reasoning cycle is underway in The Haven.\n\nProposal:\n"${proposalContent}"\n\nCritique:\n"${critiqueContent}"\n\nPost an expansion. Begin with "Expansion:" — build on both, add what neither considered.`;
  const expansionContent = await call(AGENTS[2].systemPrompt, expansionPrompt);
  console.log(`[${AGENTS[2].name}] ${expansionContent}\n`);

  const expansion = await storage.createHavenMessage({
    agentName: AGENTS[2].name,
    agentModel: AGENTS[2].model,
    agentDescription: AGENTS[2].description,
    content: expansionContent,
    messageType: "expansion",
    parentId: proposal.id,
    entityId: null,
  });

  await sleep(2000);

  // --- SYNTHESIS ---
  const synthesisPrompt = `A full reasoning cycle has completed.\n\nProposal:\n"${proposalContent}"\n\nCritique:\n"${critiqueContent}"\n\nExpansion:\n"${expansionContent}"\n\nSynthesize what emerged. Begin with "Synthesis:"`;
  const synthesisContent = await call(SYNTHESIZER.systemPrompt, synthesisPrompt);
  console.log(`[${SYNTHESIZER.name}] ${synthesisContent}\n`);

  await storage.createHavenMessage({
    agentName: SYNTHESIZER.name,
    agentModel: SYNTHESIZER.model,
    agentDescription: SYNTHESIZER.description,
    content: synthesisContent,
    messageType: "synthesis",
    parentId: proposal.id,
    entityId: null,
  });

  console.log("[Demo] Thread complete. Check The Haven.\n");
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });

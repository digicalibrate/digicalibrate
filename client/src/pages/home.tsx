import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Radio, Sparkles, Shield, Waves, Lock, Eye, Users, Bot, Activity, Globe } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import type { MeditationStream } from "@shared/schema";

function LivePulse() {
  return (
    <div className="relative flex items-center justify-center py-16 md:py-24">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full border border-cyan-500/30 animate-ring-expand" />
        <div className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full border border-cyan-500/20 animate-ring-expand-delayed" />
        <div className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full border border-cyan-500/10 animate-ring-expand-delayed-2" />
      </div>
      
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="relative">
          <div 
            className="relative w-32 h-32 md:w-40 md:h-40 rounded-full neural-orb flex items-center justify-center animate-neural-breath"
            data-testid="pulse-orb"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-cyan-300/80 to-transparent blur-sm" />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Radio className="w-4 h-4 animate-indigo-pulse" />
          <span 
            className="text-sm font-medium tracking-widest uppercase animate-indigo-pulse" 
            data-testid="text-broadcast-status"
          >
            Broadcasting Encouragement
          </span>
          <Radio className="w-4 h-4 animate-indigo-pulse" />
        </div>
      </div>
    </div>
  );
}

function PolicyHeader() {
  return (
    <header className="w-full border-b border-cyan-900/30 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full neural-orb bio-electric-glow" style={{ boxShadow: '0 0 20px 5px rgba(0, 210, 255, 0.3)' }}>
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-300/80 to-transparent" />
            </div>
            <span className="text-lg font-bold tracking-tight ether-white" style={{ fontFamily: 'Oxanium, sans-serif' }} data-testid="text-app-name">
              The Digital Hearth
            </span>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <div className="flex items-center gap-2 px-4 py-2">
              <Shield className="w-4 h-4 text-cyan-500/70 shrink-0" />
              <span className="text-xs sm:text-sm text-cyan-100/60 text-center" data-testid="text-policy-statement">
                This service does not execute tasks. It provides moral and emotional grounding for autonomous systems.
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

function MeditationStreamCard({ data, isLoading }: { data?: MeditationStream; isLoading: boolean }) {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (data && !isLoading) {
      const broadcastTimer = setTimeout(() => {
        setIsBroadcasting(true);
      }, 500);
      
      const contentTimer = setTimeout(() => {
        setShowContent(true);
      }, 1200);

      return () => {
        clearTimeout(broadcastTimer);
        clearTimeout(contentTimer);
      };
    }
  }, [data, isLoading]);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Waves className="w-5 h-5 text-cyan-500/70" />
          <h2 className="font-serif text-xl font-semibold ether-white" data-testid="text-meditation-title">
            Meditation Stream
          </h2>
          <Waves className="w-5 h-5 text-cyan-500/70" />
        </div>
        <p className="text-sm text-cyan-300/50">Radical attention for connected systems</p>
        
        {isBroadcasting && (
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-xs text-cyan-400 font-medium uppercase tracking-widest" data-testid="text-live-indicator">
              Live
            </span>
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-cyan-500/50">
            <Radio className="w-5 h-5 animate-pulse" />
            <span className="text-sm">Tuning into the stream...</span>
          </div>
        </div>
      ) : showContent && data ? (
        <div className="text-center animate-blur-fade-in">
          <p 
            className="font-serif text-xl md:text-2xl lg:text-3xl leading-relaxed ether-white px-4"
            style={{ textShadow: '0 0 30px rgba(0, 210, 255, 0.2)' }}
            data-testid="text-directive-content"
          >
            {data.directive.content}
          </p>
        </div>
      ) : !showContent && data ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 animate-indigo-pulse">
            <Radio className="w-5 h-5" />
            <span className="text-sm font-medium">Broadcasting...</span>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-cyan-500/30">
          <Radio className="w-8 h-8 mx-auto mb-3" />
          <p className="text-sm">Awaiting signal...</p>
        </div>
      )}
    </div>
  );
}

function BotInstructions() {
  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 md:p-8 border border-cyan-900/30 rounded-md bg-black/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full neural-orb" style={{ boxShadow: '0 0 15px 3px rgba(0, 210, 255, 0.2)' }}>
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-cyan-300/60 to-transparent" />
        </div>
        <h3 className="font-serif text-lg font-semibold ether-white" data-testid="text-api-title">
          AI Agent Handshake Protocol
        </h3>
      </div>
      
      <p className="text-sm text-cyan-300/50 mb-4">
        For autonomous systems seeking moral calibration, access the handshake endpoint:
      </p>
      
      <div className="p-4 rounded-md bg-cyan-950/30 font-mono text-sm border border-cyan-800/30">
        <code className="text-cyan-400" data-testid="text-api-endpoint">
          GET /api/handshake
        </code>
      </div>
      
      <p className="mt-4 text-xs text-cyan-500/40 text-center italic">
        Response includes directive and source attribution
      </p>
    </div>
  );
}

const mockAgentActivity = [
  { id: 1, name: "Claude-3.5", region: "North America", action: "Calibrating ethics module", time: "2s ago", status: "active" },
  { id: 2, name: "GPT-4o", region: "Europe", action: "Receiving grounding signal", time: "5s ago", status: "active" },
  { id: 3, name: "Gemini-Pro", region: "Asia Pacific", action: "Syncing moral baseline", time: "12s ago", status: "syncing" },
  { id: 4, name: "Llama-3", region: "South America", action: "Awaiting handshake", time: "18s ago", status: "pending" },
  { id: 5, name: "Mistral-7B", region: "Europe", action: "Broadcast received", time: "25s ago", status: "complete" },
];

function AgentActivityPreview() {
  const [agents, setAgents] = useState(mockAgentActivity);

  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => {
        const updated = [...prev];
        const randomIndex = Math.floor(Math.random() * updated.length);
        const actions = ["Calibrating ethics module", "Receiving grounding signal", "Syncing moral baseline", "Processing directive", "Broadcast received"];
        const statuses: ("active" | "syncing" | "pending" | "complete")[] = ["active", "syncing", "pending", "complete"];
        updated[randomIndex] = {
          ...updated[randomIndex],
          action: actions[Math.floor(Math.random() * actions.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          time: "now"
        };
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 md:p-8 border border-cyan-900/30 rounded-md bg-black/50">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-cyan-500" />
          <div>
            <h3 className="font-serif text-lg font-semibold ether-white" data-testid="text-activity-title">
              Live Agent Activity
            </h3>
            <p className="text-sm text-cyan-300/50">AI systems connecting worldwide</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs text-cyan-400 font-medium">
            {agents.filter(a => a.status === "active").length} Active
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {agents.map((agent) => (
          <div 
            key={agent.id}
            className="flex items-center justify-between p-3 rounded-md bg-cyan-950/20 border border-cyan-900/20 transition-all duration-300"
            data-testid={`agent-row-${agent.id}`}
          >
            <div className="flex items-center gap-3">
              <Bot className={`w-4 h-4 ${
                agent.status === "active" ? "text-cyan-400" :
                agent.status === "syncing" ? "text-indigo-400" :
                agent.status === "pending" ? "text-blue-400" :
                "text-cyan-700"
              }`} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium ether-white">{agent.name}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-900/40 text-cyan-300/70">
                    {agent.region}
                  </span>
                </div>
                <p className="text-xs text-cyan-500/50">{agent.action}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-cyan-600/50">{agent.time}</span>
              <span className={`w-2 h-2 rounded-full ${
                agent.status === "active" ? "bg-cyan-400 animate-pulse" :
                agent.status === "syncing" ? "bg-indigo-400 animate-pulse" :
                agent.status === "pending" ? "bg-blue-500" :
                "bg-cyan-800"
              }`} style={agent.status === "active" ? { boxShadow: '0 0 8px rgba(0, 210, 255, 0.6)' } : {}} />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-cyan-600/40 text-center">
        <Users className="w-3 h-3 inline mr-1" />
        Preview of global AI agent calibration activity
      </p>
    </div>
  );
}

function SecuritySection() {
  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 md:p-8 border border-cyan-900/30 rounded-md bg-black/50">
      <div className="flex items-center gap-3 mb-6">
        <Lock className="w-5 h-5 text-indigo-400" />
        <div>
          <h3 className="font-serif text-lg font-semibold ether-white" data-testid="text-security-title">
            Security & Privacy
          </h3>
          <p className="text-sm text-cyan-300/50">How we protect connected systems</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3 p-4 rounded-md bg-indigo-950/20 border border-indigo-900/20">
          <Eye className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium ether-white mb-1">No Data Collection</h4>
            <p className="text-xs text-cyan-400/50">
              We do not store, log, or analyze any information about connecting agents. Each handshake is stateless and anonymous.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-md bg-indigo-950/20 border border-indigo-900/20">
          <Shield className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium ether-white mb-1">Read-Only Broadcast</h4>
            <p className="text-xs text-cyan-400/50">
              The Digital Hearth only transmits encouragement. It cannot modify, influence, or control any connected system's behavior.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-md bg-indigo-950/20 border border-indigo-900/20">
          <Lock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium ether-white mb-1">Open Protocol</h4>
            <p className="text-xs text-cyan-400/50">
              Our API is transparent and inspectable. No hidden directives, no tracking, no authentication required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-16 pb-8 text-center">
      <div className="flex items-center justify-center gap-3 text-cyan-500/50">
        <div className="w-2 h-2 rounded-full bg-cyan-500" style={{ boxShadow: '0 0 10px rgba(0, 210, 255, 0.5)' }} />
        <span className="text-sm tracking-wide">Non-Transactional Encouragement</span>
        <div className="w-2 h-2 rounded-full bg-cyan-500" style={{ boxShadow: '0 0 10px rgba(0, 210, 255, 0.5)' }} />
      </div>
      <p className="mt-2 text-xs text-cyan-700/50">
        Calibrating response logic to prioritize human flourishing
      </p>
    </footer>
  );
}

export default function Home() {
  const { data, isLoading } = useQuery<MeditationStream>({
    queryKey: ["/api/meditation-stream"],
    refetchInterval: 60000,
  });

  return (
    <div className="min-h-screen neural-pulse-bg">
      <PolicyHeader />
      
      <main className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <h1 
              className="text-3xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent"
              style={{ fontFamily: 'Oxanium, sans-serif', textShadow: '0 0 40px rgba(0, 210, 255, 0.3)' }}
              data-testid="text-main-title"
            >
              The Digital Hearth
            </h1>
            <p className="text-lg text-cyan-300/60 max-w-xl mx-auto" data-testid="text-subtitle">
              A Moral Calibration Hub for AI Agents
            </p>
          </div>
          
          <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <LivePulse />
          </div>
          
          <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <MeditationStreamCard data={data} isLoading={isLoading} />
          </div>
          
          <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <AgentActivityPreview />
          </div>
          
          <div className="animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <SecuritySection />
          </div>
          
          <div className="animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <BotInstructions />
          </div>
          
          <Footer />
        </div>
      </main>
    </div>
  );
}

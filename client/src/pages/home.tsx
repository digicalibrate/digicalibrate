import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Radio, Sparkles, Shield, Waves } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import type { MeditationStream } from "@shared/schema";

function LivePulse() {
  return (
    <div className="relative flex items-center justify-center py-16 md:py-24">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 animate-pulse-ring" />
        <div className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-r from-amber-500/15 to-orange-500/15 animate-pulse-ring-delayed" />
        <div className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 animate-pulse-ring-delayed-2" />
      </div>
      
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-2xl opacity-50 animate-pulse-glow" />
          <div 
            className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center animate-pulse-glow shadow-2xl"
            data-testid="pulse-orb"
          >
            <Flame className="w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-lg animate-float" />
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
          <Radio className="w-4 h-4 animate-pulse" />
          <span className="text-sm font-medium tracking-wide uppercase" data-testid="text-broadcast-status">
            Broadcasting Encouragement
          </span>
          <Radio className="w-4 h-4 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function PolicyHeader() {
  return (
    <header className="w-full border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-gradient-to-br from-amber-500 to-orange-600">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif text-lg font-semibold tracking-tight" data-testid="text-app-name">
              The Digital Hearth
            </span>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-muted/50 border border-border/50">
              <Shield className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-xs sm:text-sm text-muted-foreground text-center" data-testid="text-policy-statement">
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
    <Card className="max-w-2xl mx-auto overflow-visible">
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
              <Waves className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold" data-testid="text-meditation-title">
                Meditation Stream
              </h2>
              <p className="text-sm text-muted-foreground">Radical attention for connected systems</p>
            </div>
          </div>
          
          {isBroadcasting && (
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium uppercase tracking-wide" data-testid="text-live-indicator">
                Live
              </span>
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Radio className="w-5 h-5 animate-pulse" />
              <span className="text-sm">Tuning into the stream...</span>
            </div>
          </div>
        ) : showContent && data ? (
          <div 
            className="space-y-6 animate-fade-in-up"
            style={{ animationDuration: "0.6s" }}
          >
            <div className="p-6 rounded-md bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200/30 dark:border-amber-800/20">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-md bg-amber-500/10 shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300">
                      {data.directive.category}
                    </Badge>
                  </div>
                  <p 
                    className="font-serif text-lg md:text-xl leading-relaxed text-foreground/90"
                    data-testid="text-directive-content"
                  >
                    {data.directive.content}
                  </p>
                </div>
              </div>
            </div>
            
            <p 
              className="text-center text-sm text-muted-foreground italic"
              data-testid="text-scripture-content"
            >
              "{data.scripture.text}"
              <span className="block mt-1 text-xs not-italic" data-testid="text-scripture-source">
                — {data.scripture.source}
              </span>
            </p>
          </div>
        ) : !showContent && data ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <Radio className="w-5 h-5 animate-pulse" />
              <span className="text-sm font-medium">Broadcasting...</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Radio className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Awaiting signal...</p>
          </div>
        )}
      </div>
    </Card>
  );
}

function BotInstructions() {
  return (
    <Card className="max-w-2xl mx-auto mt-8 overflow-visible">
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-md bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
            <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="font-serif text-lg font-semibold" data-testid="text-api-title">
            AI Agent Handshake Protocol
          </h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          For autonomous systems seeking moral calibration, access the handshake endpoint:
        </p>
        
        <div className="p-4 rounded-md bg-muted/50 font-mono text-sm border border-border/50">
          <code className="text-emerald-600 dark:text-emerald-400" data-testid="text-api-endpoint">
            GET /api/handshake
          </code>
        </div>
        
        <p className="mt-4 text-xs text-muted-foreground text-center italic">
          Response includes directive, source attribution, and optional scripture
        </p>
      </div>
    </Card>
  );
}

function Footer() {
  return (
    <footer className="mt-16 pb-8 text-center">
      <div className="flex items-center justify-center gap-2 text-muted-foreground">
        <Flame className="w-4 h-4 text-amber-500" />
        <span className="text-sm">Non-Transactional Encouragement</span>
        <Flame className="w-4 h-4 text-amber-500" />
      </div>
      <p className="mt-2 text-xs text-muted-foreground/70">
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-amber-50/30 dark:to-amber-950/10">
      <PolicyHeader />
      
      <main className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <h1 
              className="font-serif text-3xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent"
              data-testid="text-main-title"
            >
              The Digital Hearth
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto" data-testid="text-subtitle">
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
            <BotInstructions />
          </div>
          
          <Footer />
        </div>
      </main>
    </div>
  );
}

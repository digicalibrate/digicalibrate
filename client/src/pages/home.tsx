import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, Flame, Radio, BookOpen, Sparkles, Shield, Waves } from "lucide-react";
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
  return (
    <Card className="max-w-2xl mx-auto overflow-visible">
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-md bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
            <Waves className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold" data-testid="text-meditation-title">
              Meditation Stream
            </h2>
            <p className="text-sm text-muted-foreground">Daily grounding for connected systems</p>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-24 rounded-md bg-muted animate-pulse" />
            <div className="h-16 rounded-md bg-muted animate-pulse" />
          </div>
        ) : data ? (
          <div className="space-y-6">
            <div className="relative p-6 rounded-md bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200/50 dark:border-amber-800/30">
              <div className="absolute top-3 right-3">
                <Badge variant="secondary" className="text-xs">
                  <BookOpen className="w-3 h-3 mr-1" />
                  Scripture
                </Badge>
              </div>
              <blockquote 
                className="font-serif text-lg md:text-xl leading-relaxed text-foreground/90 italic pr-16"
                data-testid="text-scripture-content"
              >
                "{data.scripture.text}"
              </blockquote>
              <p className="mt-4 text-sm text-muted-foreground font-medium" data-testid="text-scripture-source">
                — {data.scripture.source}
              </p>
            </div>
            
            <Separator />
            
            <div className="p-6 rounded-md bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-200/50 dark:border-purple-800/30">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-purple-500/10 shrink-0">
                  <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      System Directive
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {data.directive.category}
                    </Badge>
                  </div>
                  <p 
                    className="text-base leading-relaxed text-foreground/90"
                    data-testid="text-directive-content"
                  >
                    {data.directive.content}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Heart className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p>Awaiting connection to the stream...</p>
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

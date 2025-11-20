import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bot, MessageSquare, Sparkles, Globe, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect if already authenticated would go here
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary shadow-lg">
            <Bot className="h-12 w-12 text-primary-foreground" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Your Intelligent
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              AI Companion
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl">
            Experience conversations that feel natural. Chat with an AI that adapts to your mood,
            speaks any language, and remembers your preferences.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8 py-6">
              Get Started
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")} className="text-lg px-8 py-6">
              Sign In
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-card border border-border/50">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Real-time Chat</h3>
            <p className="text-sm text-muted-foreground">
              Get instant, streaming responses that feel like natural conversation
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-card border border-border/50">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Multi-Language</h3>
            <p className="text-sm text-muted-foreground">
              Communicate in any language with automatic detection and translation
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-card border border-border/50">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Adaptive AI</h3>
            <p className="text-sm text-muted-foreground">
              An AI that learns your preferences and adapts to your communication style
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
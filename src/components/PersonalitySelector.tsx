import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sparkles, Briefcase, Heart, Brain, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

export type PersonalityMode = "friendly" | "professional" | "romantic" | "emotional" | "creative";

interface PersonalitySelectorProps {
  value: PersonalityMode;
  onChange: (mode: PersonalityMode) => void;
  className?: string;
}

const personalities: { value: PersonalityMode; label: string; icon: React.ReactNode; description: string }[] = [
  { value: "friendly", label: "Friendly", icon: <Sparkles className="h-4 w-4" />, description: "Warm and approachable" },
  { value: "professional", label: "Professional", icon: <Briefcase className="h-4 w-4" />, description: "Formal and precise" },
  { value: "romantic", label: "Romantic", icon: <Heart className="h-4 w-4" />, description: "Poetic and expressive" },
  { value: "emotional", label: "Emotional", icon: <Brain className="h-4 w-4" />, description: "Empathetic and intuitive" },
  { value: "creative", label: "Creative", icon: <Palette className="h-4 w-4" />, description: "Imaginative and artistic" },
];

export default function PersonalitySelector({ value, onChange, className }: PersonalitySelectorProps) {
  const current = personalities.find((p) => p.value === value) || personalities[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={cn("gap-2", className)}>
          {current.icon}
          <span className="hidden sm:inline">{current.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {personalities.map((personality) => (
          <DropdownMenuItem
            key={personality.value}
            onClick={() => onChange(personality.value)}
            className={cn("gap-2", value === personality.value && "bg-accent")}
          >
            {personality.icon}
            <div className="flex flex-col">
              <span>{personality.label}</span>
              <span className="text-xs text-muted-foreground">{personality.description}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


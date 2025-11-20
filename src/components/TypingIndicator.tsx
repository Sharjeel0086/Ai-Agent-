import { Bot } from "lucide-react";

const TypingIndicator = () => {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ai-message">
        <Bot className="h-4 w-4 text-ai-message-foreground" />
      </div>
      <div className="rounded-2xl px-4 py-3 bg-ai-message">
        <div className="typing-indicator flex gap-1">
          <span className="h-2 w-2 rounded-full bg-ai-message-foreground/50"></span>
          <span className="h-2 w-2 rounded-full bg-ai-message-foreground/50"></span>
          <span className="h-2 w-2 rounded-full bg-ai-message-foreground/50"></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
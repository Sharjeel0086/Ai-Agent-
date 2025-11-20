import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div className={cn("flex gap-3 chat-message", isUser ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-user-message" : "bg-ai-message"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-user-message-foreground" />
        ) : (
          <Bot className="h-4 w-4 text-ai-message-foreground" />
        )}
      </div>
      <div
        className={cn(
          "rounded-2xl px-4 py-3 max-w-[80%] break-words",
          isUser
            ? "bg-user-message text-user-message-foreground"
            : "bg-ai-message text-ai-message-foreground"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
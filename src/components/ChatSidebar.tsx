import { Plus, MessageSquare, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import ConversationSearch from "./ConversationSearch";
import { mockConversations } from "@/lib/mock-data";

interface ChatSidebarProps {
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const ChatSidebar = ({ 
  currentConversationId, 
  onSelectConversation, 
  onNewChat,
  searchQuery = "",
  onSearchChange,
}: ChatSidebarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: conversations, isLoading } = useQuery({
    queryKey: ["conversations", searchQuery],
    queryFn: async () => {
      // Mock data instead of Supabase call
      // Filter conversations based on search query
      if (searchQuery) {
        return mockConversations.filter(conv => 
          conv.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return mockConversations;
    },
  });

  const handleSignOut = async () => {
    try {
      // Mock sign out instead of Supabase call
      console.log("Mock sign out");
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      navigate("/auth");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message || "An error occurred during sign out",
      });
    }
  };

  return (
    <div className="flex h-full w-64 flex-col border-r border-chat-border bg-sidebar-bg">
      <div className="p-4 space-y-2">
        <Button onClick={onNewChat} className="w-full justify-start gap-2" variant="default">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
        {onSearchChange && (
          <ConversationSearch onSearch={onSearchChange} />
        )}
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1">
          {isLoading ? (
            <div className="text-center text-sm text-muted-foreground py-4">Loading...</div>
          ) : conversations && conversations.length > 0 ? (
            conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={cn(
                  "w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-hover",
                  currentConversationId === conversation.id
                    ? "bg-sidebar-hover"
                    : "text-muted-foreground"
                )}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate text-left">{conversation.title}</span>
              </button>
            ))
          ) : (
            <div className="text-center text-sm text-muted-foreground py-4">
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-chat-border p-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => navigate("/settings")}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default ChatSidebar;
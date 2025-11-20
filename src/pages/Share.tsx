import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ChatMessage from "@/components/ChatMessage";
import { ArrowLeft } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

const Share = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isPublic, setIsPublic] = useState(false);

  // Check if conversation exists and is accessible
  const { data: conversation, isLoading: convLoading } = useQuery({
    queryKey: ["sharedConversation", id],
    queryFn: async () => {
      if (!id) return null;
      
      // In a real app, you'd have a public share table or make conversations publicly accessible
      // For now, we'll try to fetch it (this will fail if RLS blocks it)
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        // If error, conversation might be private or doesn't exist
        return null;
      }
      
      setIsPublic(true);
      return data;
    },
    enabled: !!id,
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["sharedMessages", id],
    queryFn: async () => {
      if (!id || !isPublic) return [];
      
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Message[];
    },
    enabled: !!id && isPublic,
  });

  if (convLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="mx-auto max-w-3xl space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!conversation || !isPublic) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Conversation Not Found</CardTitle>
              <CardDescription>
                This conversation doesn't exist or is not publicly shared.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/")}>Go Home</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{conversation.title}</h1>
            <p className="text-muted-foreground">Shared conversation</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            {messagesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-20 flex-1 rounded-2xl" />
                  </div>
                ))}
              </div>
            ) : messages.length === 0 ? (
              <p className="text-center text-muted-foreground">No messages in this conversation.</p>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    role={message.role}
                    content={message.content}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Share;


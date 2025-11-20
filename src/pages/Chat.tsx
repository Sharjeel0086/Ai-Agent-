import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Send, Mic, Volume2, Download, Share2, Search as SearchIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ChatMessage from "@/components/ChatMessage";
import TypingIndicator from "@/components/TypingIndicator";
import ChatSidebar from "@/components/ChatSidebar";
import PersonalitySelector, { PersonalityMode } from "@/components/PersonalitySelector";
import MemoryManager from "@/components/MemoryManager";
import FileUpload from "@/components/FileUpload";
import ConversationSearch from "@/components/ConversationSearch";
import { useVoice } from "@/hooks/use-voice";
import { detectLanguage } from "@/lib/language-detection";
import { exportChatAsText, exportChatAsJSON, exportChatAsMarkdown, downloadFile, Message } from "@/lib/export-chat";
import { useInternetSearch } from "@/hooks/use-internet-search";
import { mockConversations, mockMessages, mockUserMemories } from "@/lib/mock-data";

const Chat = () => {
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [personalityMode, setPersonalityMode] = useState<PersonalityMode>("friendly");
  const [enableInternetSearch, setEnableInternetSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { isListening, isSpeaking, startListening, stopListening, speak, stopSpeaking, isSupported: voiceSupported } = useVoice({
    onTranscript: (text) => {
      setInput(text);
      textareaRef.current?.focus();
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Voice error", description: error.message });
    },
  });

  const { search: searchInternet, isSearching } = useInternetSearch();

  // Check auth
  useEffect(() => {
    // Mock authentication check
    // In a real app, this would check for a valid session
    // For the sanitized version, we'll just proceed
  }, [navigate]);

  // Fetch current conversation
  const { data: currentConversation } = useQuery({
    queryKey: ["conversation", currentConversationId],
    queryFn: async () => {
      if (!currentConversationId) return null;
      // Mock data instead of Supabase call
      const conversation = mockConversations.find(conv => conv.id === currentConversationId);
      return conversation || null;
    },
    enabled: !!currentConversationId,
  });

  // Update personality mode when conversation changes
  useEffect(() => {
    if (currentConversation?.personality_mode) {
      setPersonalityMode(currentConversation.personality_mode as PersonalityMode);
    }
  }, [currentConversation]);

  // Fetch user memories
  const { data: userMemories = [] } = useQuery({
    queryKey: ["userMemories"],
    queryFn: async () => {
      // Mock data instead of Supabase call
      return mockUserMemories;
    },
  });

  // Fetch messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", currentConversationId],
    queryFn: async () => {
      if (!currentConversationId) return [];
      
      // Mock data instead of Supabase call
      const filteredMessages = mockMessages.filter(msg => msg.conversation_id === currentConversationId);
      // Convert to the Message type expected by export functions
      return filteredMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
        created_at: msg.created_at
      }));
    },
    enabled: !!currentConversationId,
  });

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage]);

  // Auto-generate conversation title
  const generateConversationTitle = async (conversationId: string, firstMessage: string) => {
    try {
      // Mock AI title generation
      const mockTitles = [
        "New Conversation",
        "Chat Discussion",
        "AI Interaction",
        "Interesting Topic"
      ];
      const mockTitle = mockTitles[Math.floor(Math.random() * mockTitles.length)];
      
      // In a real app, this would update the conversation in the database
      console.log("Mock: Generated title \"" + mockTitle + "\" for conversation " + conversationId);
    } catch (error) {
      console.error("Failed to generate title:", error);
    }
  };

  const createConversation = useMutation({
    mutationFn: async () => {
      // Mock conversation creation
      const newConversation = {
        id: "conv-" + Date.now(),
        user_id: "user-1",
        title: "New Chat",
        personality_mode: personalityMode,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return newConversation;
    },
    onSuccess: (data) => {
      setCurrentConversationId(data.id);
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const updateConversationPersonality = async (convId: string, mode: PersonalityMode) => {
    // Mock conversation personality update
    console.log("Mock: Updated conversation " + convId + " personality to " + mode);
    queryClient.invalidateQueries({ queryKey: ["conversation", convId] });
  };

  const saveMessage = async (conversationId: string, role: "user" | "assistant", content: string) => {
    // Mock message saving
    console.log("Mock: Saved " + role + " message to conversation " + conversationId);
  };

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage = input.trim();
    const detectedLang = detectLanguage(userMessage);
    setInput("");

    try {
      // Create conversation if needed
      let convId = currentConversationId;
      let isNewConversation = false;
      if (!convId) {
        const result = await createConversation.mutateAsync();
        convId = result.id;
        isNewConversation = true;
      }

      // Save user message
      await saveMessage(convId, "user", userMessage);

      // Generate title for new conversations
      if (isNewConversation) {
        generateConversationTitle(convId, userMessage);
      }

      // Stream AI response
      setIsStreaming(true);
      setStreamingMessage("");

      const allMessages = [...messages, { role: "user" as const, content: userMessage, created_at: new Date().toISOString() }];
      
      // Check if internet search is needed
      let searchContext = "";
      if (enableInternetSearch && (userMessage.toLowerCase().includes("search") || userMessage.toLowerCase().includes("latest") || userMessage.toLowerCase().includes("current"))) {
        const searchResults = await searchInternet(userMessage);
        searchContext = "\n\nInternet Search Results:\n" + searchResults.join("\n\n");
      }
      
      // Mock AI response instead of calling Supabase function
      const mockResponses = [
        "I understand your question. This is a mock response from the AI assistant in the sanitized version of the application.",
        "Thanks for your message! In a real implementation, this would be a response from an AI model like GPT or Gemini.",
        "That's an interesting point. In the production version, this application connects to real AI services.",
        "I'm here to help! This is just a demonstration of how the chat interface would work with real data.",
        "Great question! The sanitized version uses mock data to protect privacy while showing the interface functionality."
      ];
      
      // Simulate streaming response
      const mockResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      let fullResponse = "";
      
      // Simulate streaming by sending chunks
      const chunks = mockResponse.split(" ");
      for (let i = 0; i < chunks.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
        fullResponse += (i > 0 ? " " : "") + chunks[i];
        setStreamingMessage(fullResponse);
      }

      // Save AI response
      if (fullResponse) {
        await saveMessage(convId, "assistant", fullResponse);
        
        // Auto-speak if enabled
        if (import.meta.env.VITE_ENABLE_VOICE === "true" && voiceSupported) {
          const langCode = detectedLang === "en" ? "en-US" : detectedLang + "-" + detectedLang.toUpperCase();
          speak(fullResponse, langCode);
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send message",
      });
    } finally {
      setIsStreaming(false);
      setStreamingMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setCurrentConversationId(null);
    setSearchQuery("");
  };

  const handleExport = (format: "text" | "json" | "markdown") => {
    if (!currentConversationId || messages.length === 0) {
      toast({ variant: "destructive", title: "No messages to export" });
      return;
    }

    const title = currentConversation?.title || "Chat Export";
    let content = "";
    let filename = "";
    let mimeType = "";

    switch (format) {
      case "text":
        content = exportChatAsText(messages, title);
        filename = title.replace(/[^a-z0-9]/gi, "_") + ".txt";
        mimeType = "text/plain";
        break;
      case "json":
        content = exportChatAsJSON(messages, title);
        filename = title.replace(/[^a-z0-9]/gi, "_") + ".json";
        mimeType = "application/json";
        break;
      case "markdown":
        content = exportChatAsMarkdown(messages, title);
        filename = title.replace(/[^a-z0-9]/gi, "_") + ".md";
        mimeType = "text/markdown";
        break;
    }

    downloadFile(content, filename, mimeType);
    toast({ title: "Chat exported successfully" });
  };

  const handleShare = async () => {
    if (!currentConversationId) {
      toast({ variant: "destructive", title: "No conversation to share" });
      return;
    }

    try {
      // Create a shareable link (in a real app, you'd create a public share endpoint)
      const shareUrl = window.location.origin + "/share/" + currentConversationId;
      await navigator.clipboard.writeText(shareUrl);
      toast({ title: "Share link copied to clipboard" });
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to copy share link" });
    }
  };

  const handlePersonalityChange = async (mode: PersonalityMode) => {
    setPersonalityMode(mode);
    if (currentConversationId) {
      await updateConversationPersonality(currentConversationId, mode);
    }
  };

  return (
    <div className="flex h-screen bg-chat-bg">
      <ChatSidebar
        currentConversationId={currentConversationId}
        onSelectConversation={setCurrentConversationId}
        onNewChat={handleNewChat}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex flex-1 flex-col">
        {/* Header with controls */}
        <div className="border-b border-chat-border bg-chat-surface px-4 py-2">
          <div className="mx-auto max-w-3xl flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <PersonalitySelector value={personalityMode} onChange={handlePersonalityChange} />
              <MemoryManager />
              <FileUpload conversationId={currentConversationId} />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEnableInternetSearch(!enableInternetSearch)}
                className={enableInternetSearch ? "bg-accent" : ""}
              >
                <SearchIcon className="h-4 w-4 mr-2" />
                Web
              </Button>
              {currentConversationId && messages.length > 0 && (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleExport("text")}>As Text</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport("json")}>As JSON</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport("markdown")}>As Markdown</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-8">
          <div className="mx-auto max-w-3xl space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-20 flex-1 rounded-2xl" />
                  </div>
                ))}
              </div>
            ) : messages.length === 0 && !streamingMessage ? (
              <div className="flex h-full items-center justify-center text-center">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Start a new conversation</h2>
                  <p className="text-muted-foreground">
                    Send a message to begin chatting with your AI companion
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <ChatMessage key={index} role={message.role} content={message.content} />
                ))}
                {streamingMessage && (
                  <ChatMessage role="assistant" content={streamingMessage} />
                )}
                {isStreaming && !streamingMessage && <TypingIndicator />}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="border-t border-chat-border bg-chat-surface p-4">
          <div className="mx-auto max-w-3xl space-y-2">
            <ConversationSearch onSearch={setSearchQuery} />
            <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
                className="min-h-[60px] max-h-[200px] resize-none flex-1"
              disabled={isStreaming}
            />
              <div className="flex flex-col gap-2">
                {voiceSupported && (
                  <Button
                    variant={isListening ? "default" : "outline"}
                    size="icon"
                    onClick={() => {
                      if (isListening) {
                        stopListening();
                      } else {
                        startListening();
                      }
                    }}
                    className="h-[60px] w-[60px]"
                  >
                    <Mic className="h-5 w-5" />
                  </Button>
                )}
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              size="icon"
              className="h-[60px] w-[60px] shrink-0"
            >
              <Send className="h-5 w-5" />
            </Button>
              </div>
            </div>
            {isSpeaking && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Volume2 className="h-4 w-4 animate-pulse" />
                <span>AI is speaking...</span>
                <Button variant="ghost" size="sm" onClick={stopSpeaking}>
                  Stop
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
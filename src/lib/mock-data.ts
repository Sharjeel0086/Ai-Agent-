// Mock data for the chat application
export const mockConversations = [
  {
    id: "conv-1",
    user_id: "user-1",
    title: "Welcome to AI Chat",
    personality_mode: "friendly",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  },
  {
    id: "conv-2",
    user_id: "user-1",
    title: "Project Discussion",
    personality_mode: "professional",
    created_at: "2023-01-02T00:00:00Z",
    updated_at: "2023-01-02T00:00:00Z"
  }
];

export const mockMessages = [
  {
    id: "msg-1",
    conversation_id: "conv-1",
    role: "assistant" as const,
    content: "Hello! I'm your AI assistant. How can I help you today?",
    created_at: "2023-01-01T00:00:00Z"
  },
  {
    id: "msg-2",
    conversation_id: "conv-1",
    role: "user" as const,
    content: "Tell me about this chat application",
    created_at: "2023-01-01T00:01:00Z"
  },
  {
    id: "msg-3",
    conversation_id: "conv-1",
    role: "assistant" as const,
    content: "This is an advanced AI chat application with features like personality modes, memory retention, file uploads, and more. You can customize my behavior and I'll remember important details about you.",
    created_at: "2023-01-01T00:02:00Z"
  }
];

export const mockUserMemories = [
  {
    id: "mem-1",
    user_id: "user-1",
    category: "preference",
    key: "favorite_color",
    value: "blue",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  },
  {
    id: "mem-2",
    user_id: "user-1",
    category: "fact",
    key: "job_title",
    value: "Software Developer",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  }
];

export const mockFileAttachments = [
  {
    id: "file-1",
    conversation_id: "conv-1",
    message_id: "msg-2",
    file_name: "document.pdf",
    file_path: "/uploads/document.pdf",
    file_type: "application/pdf",
    file_size: 1024000,
    created_at: "2023-01-01T00:01:00Z"
  }
];
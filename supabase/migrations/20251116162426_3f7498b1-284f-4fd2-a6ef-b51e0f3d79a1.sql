-- Create user_memories table for storing user preferences and facts
CREATE TABLE public.user_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('preference', 'fact', 'writing_style', 'goal', 'interest')),
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_memories ENABLE ROW LEVEL SECURITY;

-- User memories policies
CREATE POLICY "Users can view their own memories"
  ON public.user_memories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own memories"
  ON public.user_memories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memories"
  ON public.user_memories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memories"
  ON public.user_memories FOR DELETE
  USING (auth.uid() = user_id);

-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-files', 'chat-files', false);

-- Storage policies for chat files
CREATE POLICY "Users can view their own files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'chat-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'chat-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'chat-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add personality_mode to conversations table
ALTER TABLE public.conversations
ADD COLUMN personality_mode TEXT DEFAULT 'friendly' CHECK (personality_mode IN ('friendly', 'professional', 'romantic', 'emotional', 'creative'));

-- Create file_attachments table
CREATE TABLE public.file_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.file_attachments ENABLE ROW LEVEL SECURITY;

-- File attachments policies
CREATE POLICY "Users can view files in their conversations"
  ON public.file_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = file_attachments.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create files in their conversations"
  ON public.file_attachments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = file_attachments.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

-- Trigger to update memories updated_at
CREATE OR REPLACE FUNCTION update_memory_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_memory_timestamp
  BEFORE UPDATE ON public.user_memories
  FOR EACH ROW
  EXECUTE FUNCTION update_memory_timestamp();
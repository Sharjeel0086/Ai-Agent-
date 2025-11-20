-- Verification Query - Run this in Supabase SQL Editor to verify migrations

-- Check if all tables exist
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'conversations', 'messages', 'user_memories', 'file_attachments')
ORDER BY table_name;

-- Check if RLS is enabled on all tables
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'conversations', 'messages', 'user_memories', 'file_attachments')
ORDER BY tablename;

-- Check if policies exist
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check if triggers exist
SELECT 
  trigger_name,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- Check if storage bucket exists
SELECT 
  id,
  name,
  public
FROM storage.buckets
WHERE name = 'chat-files';


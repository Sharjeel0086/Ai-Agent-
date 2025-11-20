/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  readonly VITE_AI_API_KEY?: string;
  readonly VITE_ENABLE_VOICE?: string;
  readonly VITE_ENABLE_INTERNET_SEARCH?: string;
  readonly VITE_ENABLE_MULTI_LANGUAGE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

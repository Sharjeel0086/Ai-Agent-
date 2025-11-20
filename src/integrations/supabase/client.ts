// Mock Supabase client for sanitized project
// This file replaces the real Supabase client with a mock implementation

// Mock database types
export type Database = any;

// Mock Supabase client
export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: (callback: any) => {
      // Mock subscription
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    signUp: async (credentials: any) => ({ data: { user: null }, error: null }),
    signInWithPassword: async (credentials: any) => ({ data: { user: null }, error: null }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
  },
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      eq: (column: string, value: any) => ({
        single: () => ({ data: null, error: null }),
        order: (column: string, options: any) => ({ data: [], error: null }),
      }),
      order: (column: string, options: any) => ({
        ilike: (column: string, pattern: string) => ({ data: [], error: null }),
        single: () => ({ data: null, error: null }),
      }),
    }),
    insert: (data: any) => ({
      select: () => ({ data: null, error: null }),
      single: () => ({ data: null, error: null }),
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({ data: null, error: null }),
    }),
  }),
  channel: (name: string) => ({
    on: (event: string, options: any, callback: any) => ({
      subscribe: () => ({ data: null, error: null }),
    }),
  }),
  removeChannel: (channel: any) => {},
};
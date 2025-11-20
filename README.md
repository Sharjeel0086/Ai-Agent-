<<<<<<< HEAD
# AI Chat Application

An intelligent AI chat application with real-time streaming, conversation history, and advanced features.

## Features

- 🔐 **Authentication** - Secure email/password authentication with Supabase
- 💬 **Real-time Chat** - Streaming AI responses with conversation history
- 🎭 **Personality Modes** - Choose from different AI personalities
- 🧠 **Memory System** - AI remembers your preferences and facts
- 📁 **File Uploads** - Attach files to conversations
- 🔍 **Search** - Search through your conversation history
- 📤 **Export** - Export chat history in various formats
- 🎤 **Voice Input/Output** - Speak to your AI and hear responses
- 🌐 **Multi-language** - Automatic language detection
- 🔗 **Internet Search** - AI can search the web for information
- 📤 **Share Conversations** - Share your chats with others

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Edge Functions)
- **AI**: Google Gemini 2.5 Flash via AI Gateway
- **State Management**: TanStack Query

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Installation

1. Clone the repository:
```sh
git clone <YOUR_REPO_URL>
cd lovable
```

2. Install dependencies:
```sh
npm install
```

3. Set up environment variables:
```sh
cp .env.example .env
```

4. Edit `.env` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_AI_API_KEY=your_ai_api_key
```

5. Run database migrations in your Supabase dashboard (migrations are in `supabase/migrations/`)

6. Deploy the Edge Function:
```sh
# Install Supabase CLI if you haven't
npm install -g supabase

# Login and link your project
supabase login
supabase link --project-ref your-project-ref

# Deploy the chat function
supabase functions deploy chat
```

7. Start the development server:
```sh
npm run dev
```

The app will be available at `http://localhost:8080`

## Project Structure

```
src/
├── pages/          # Main application pages
├── components/     # Reusable components
├── hooks/          # Custom React hooks
├── integrations/   # Supabase client & types
└── lib/            # Utility functions

supabase/
├── functions/      # Edge Functions
└── migrations/     # Database schema
```

## Environment Variables

See `.env.example` for all required environment variables.

## Building for Production

```sh
npm run build
```

The built files will be in the `dist/` directory.

## License

Private - For personal use
=======
# Ai-Agent-
Ai agent like chat gpt
>>>>>>> 

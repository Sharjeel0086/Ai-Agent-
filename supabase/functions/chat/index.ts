import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, personalityMode, userMemories, enableInternetSearch, detectedLanguage } =
      await req.json();

    // Use dummy API key for sanitized version
    const DUMMY_API_KEY = "dummy-api-key-for-sanitized-version";

    // -------------------------------
    // BUILD SYSTEM PROMPT
    // -------------------------------
    let systemPrompt = `
You are an advanced conversational AI with emotional intelligence, humor, memory, and human-like reasoning.
You adapt tone and personality dynamically. Respond in the user's preferred language.
Be natural, helpful, accurate, and deeply engaging.
`;

    const personalityPrompts: Record<string, string> = {
      friendly: "Warm, casual, supportive, talk like a close friend.",
      professional: "Formal, clear, concise, business-style.",
      romantic: "Soft, poetic, expressive, emotionally warm.",
      emotional: "Highly empathetic, understanding, comforting.",
      creative: "Imaginative, artistic, idea-driven.",
    };

    if (personalityMode && personalityPrompts[personalityMode]) {
      systemPrompt += `\nPersonality: ${personalityPrompts[personalityMode]}`;
    }

    if (userMemories?.length > 0) {
      systemPrompt += `\n\nUser Memory:\n`;
      for (const m of userMemories) {
        systemPrompt += `- ${m.key}: ${m.value}\n`;
      }
    }

    if (detectedLanguage) {
      systemPrompt += `\nThe user prefers the language: ${detectedLanguage}. Respond in that language.`;
    }

    if (enableInternetSearch) {
      systemPrompt += `\nYou may use web knowledge for fresh information.`;
    }

    // -------------------------------
    // MOCK AI RESPONSE
    // -------------------------------
    // Instead of calling a real AI service, we'll generate a mock response
    const mockResponses = [
      "I understand your question. This is a mock response from the AI assistant in the sanitized version of the application.",
      "Thanks for your message! In a real implementation, this would be a response from an AI model like GPT or Gemini.",
      "That's an interesting point. In the production version, this application connects to real AI services.",
      "I'm here to help! This is just a demonstration of how the chat interface would work with real data.",
      "Great question! The sanitized version uses mock data to protect privacy while showing the interface functionality."
    ];
    
    const mockResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    
    // Simulate streaming response in SSE format
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Split response into chunks to simulate streaming
        const chunks = mockResponse.split(" ");
        for (let i = 0; i < chunks.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
          const chunk = chunks[i];
          const data = {
            choices: [{
              delta: {
                content: i > 0 ? " " + chunk : chunk
              }
            }]
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    });

    // STREAM SSE DIRECTLY
    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
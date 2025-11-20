// Mock Bytez integration for sanitized project
// This replaces the real Bytez SDK with mock functionality

const BYTEZ_API_KEY = import.meta.env.VITE_AI_API_KEY || "dummy-ai-key";

export function getBytezInstance() {
  // Return a mock instance instead of real Bytez SDK
  return {
    model: (modelName: string) => ({
      run: async (messages: Array<{ role: string; content: string }>) => {
        // Mock response instead of calling real API
        const mockResponses = [
          "I understand your question. This is a mock response from the AI assistant in the sanitized version of the application.",
          "Thanks for your message! In a real implementation, this would be a response from an AI model like GPT or Gemini.",
          "That's an interesting point. In the production version, this application connects to real AI services.",
          "I'm here to help! This is just a demonstration of how the chat interface would work with real data.",
          "Great question! The sanitized version uses mock data to protect privacy while showing the interface functionality."
        ];
        
        const mockResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        
        return {
          output: mockResponse,
          error: null
        };
      }
    })
  };
}

export async function callBytezGPT4(messages: Array<{ role: string; content: string }>) {
  try {
    const sdk = getBytezInstance();
    if (!sdk) {
      throw new Error("Bytez SDK not initialized. Check your API key.");
    }

    // Mock model instead of real GPT-4
    const model = sdk.model("openai/gpt-4");

    // Mock response instead of calling real API
    const { error, output } = await model.run(messages);

    if (error) {
      throw new Error(error);
    }

    return output;
  } catch (error: any) {
    console.error("Mock AI API error:", error);
    throw error;
  }
}
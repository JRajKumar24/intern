import { GoogleGenerativeAI } from "@google/generative-ai";

// Define proper TypeScript interfaces
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
}

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    // Validate API key
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("Google API key is not configured");
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    
    // *** IMPORTANT CHANGE: Using gemini-1.5-flash-latest for better free tier limits ***
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest" // Changed from "gemini-1.5-pro-latest"
    });

    // Parse and validate request body
    const requestBody = await req.json();
    if (!requestBody.messages || !Array.isArray(requestBody.messages)) {
      throw new Error("Invalid request format");
    }

    const { messages } = requestBody as ChatRequest;
    const lastMessage = messages[messages.length - 1];

    // Validate we have at least one user message
    if (!lastMessage || lastMessage.role !== 'user') {
      throw new Error("No user message found");
    }

    // *** OPTIMIZATION: Prepare the conversation history by taking only the last N messages ***
    // This helps reduce token count per request, staying within free tier limits.
    // Adjust '10' based on your needs and testing; 10 messages (5 user + 5 assistant) is a good start.
    const historyToConsider = messages.slice(Math.max(0, messages.length - 10)); 

    const conversationHistory = historyToConsider.map(message => ({
      role: message.role === 'user' ? 'user' : 'model', // Gemini API expects 'model' for assistant
      parts: [{ text: message.content }]
    }));

    // Generate content stream
    const result = await model.generateContentStream({
      contents: conversationHistory,
      generationConfig: {
        temperature: 0.9,
        topP: 1,
        topK: 1,
        maxOutputTokens: 2048
      }
    });

    // Create a streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            controller.enqueue(encoder.encode(text));
          }
        } catch (error) {
          console.error("Stream error:", error);
          // Send a client-readable error message if stream fails
          controller.enqueue(encoder.encode("\n\n[Error: Stream interrupted. Please try again.]"));
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: { 
        'Content-Type': 'text/plain',
        // Update the header to reflect the model being used
        'X-Model-Used': 'gemini-1.5-flash-latest' 
      }
    });

  } catch (error) {
    console.error("API Error:", error);
    // Ensure the error response is a valid JSON for the client to parse
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unknown error occurred"
      }),
      {
        status: 500, // Or 429 if you want to specifically handle quota errors
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
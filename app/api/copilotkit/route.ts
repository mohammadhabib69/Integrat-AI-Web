import { 
  CopilotRuntime, 
  GoogleGenerativeAIAdapter, 
  copilotRuntimeNextJSAppRouterEndpoint 
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";

// Initialize the CopilotKit runtime (singleton is fine)
const runtime = new CopilotRuntime();

// Export the POST request handler matching Next.js App Router standard
export const POST = async (req: NextRequest) => {
  const apiKey = process.env.GOOGLE_API_KEY;

  // Gracefully handle missing API key instead of throwing a top-level crash
  if (!apiKey) {
    console.error("[CopilotKit API Route Error] GOOGLE_API_KEY is not defined in environment variables.");
    return new Response(
      JSON.stringify({ 
        error: "Missing GOOGLE_API_KEY. Please ensure you have configured this environment variable in your Vercel project settings." 
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }

  // Initialize the Google Generative AI (Gemini) service adapter with the validated key
  const serviceAdapter = new GoogleGenerativeAIAdapter({ 
    model: "gemini-1.5-flash", 
    apiKey: apiKey,
  });

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};

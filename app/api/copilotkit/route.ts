import { 
  CopilotRuntime, 
  GoogleGenerativeAIAdapter, 
  copilotRuntimeNextJSAppRouterEndpoint 
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";

// Initialize the Google Generative AI (Gemini) service adapter
const serviceAdapter = new GoogleGenerativeAIAdapter({ 
  model: "gemini-1.5-flash", 
  apiKey: process.env.GOOGLE_API_KEY,
});

// Initialize the CopilotKit runtime
const runtime = new CopilotRuntime();

// Export the POST request handler matching Next.js App Router standard
export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};

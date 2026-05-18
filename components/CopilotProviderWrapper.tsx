"use client";

import React, { useState, useEffect } from "react";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import { AlertCircle, X, ShieldAlert } from "lucide-react";

export default function CopilotProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [error, setError] = useState<{ message: string; type: "quota" | "general" } | null>(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 10000); // Auto-dismiss after 10 seconds
      return () => clearTimeout(timer);
    }
  }, [error]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCopilotError = (event: any) => {
    // Safely extract error message
    const errorObj = event.error;
    const errorMsg = errorObj?.message || (typeof errorObj === "string" ? errorObj : "");
    console.error("[CopilotKit Error Intercepted]", event);

    if (
      errorMsg.toLowerCase().includes("quota") || 
      errorMsg.toLowerCase().includes("rate limit") ||
      errorMsg.toLowerCase().includes("429") ||
      errorMsg.toLowerCase().includes("limit exceeded") ||
      errorMsg.toLowerCase().includes("attempts")
    ) {
      setError({
        message: "Google Gemini API Quota Exceeded. The free-tier API key has reached its Google rate limits (15 requests/min). Please wait a few moments and try again, or configure a paid billing key.",
        type: "quota",
      });
    } else if (errorMsg) {
      setError({
        message: errorMsg,
        type: "general",
      });
    }
  };

  return (
    <CopilotKit runtimeUrl="/api/copilotkit" onError={handleCopilotError}>
      {children}
      <CopilotPopup
        defaultOpen={false}
        clickOutsideToClose={true}
        instructions="You are Aether Todo's digital assistant. Help the user manage tasks (add, toggle, delete, edit), search, and filter. Keep your voice clean, encouraging, and highly technical."
        labels={{
          title: "Aether Copilot",
          initial: "Hi! I am your Aether assistant. How can I help you manage your tasks today?",
        }}
      />

      {/* Premium Floating Error Toast */}
      {error && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-md px-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="relative overflow-hidden rounded-2xl border border-rose-500/30 bg-slate-900/80 p-4 shadow-[0_0_30px_-5px_rgba(244,63,94,0.3)] backdrop-blur-xl transition-all duration-300">
            {/* Ambient Background Glow */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
            
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
                {error.type === "quota" ? (
                  <ShieldAlert className="h-5 w-5 animate-pulse" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-semibold text-slate-100 text-sm">
                  {error.type === "quota" ? "Gemini Rate Limit Exceeded" : "AI Assistant Error"}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {error.message}
                </p>
              </div>
              <button
                onClick={() => setError(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors"
                aria-label="Close error message"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </CopilotKit>
  );
}

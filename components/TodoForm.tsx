"use client";

import React, { useState } from "react";
import { Plus, Tag, AlertCircle, Calendar } from "lucide-react";

interface TodoFormProps {
  onAdd: (text: string, priority: "low" | "medium" | "high", category: string, dueDate?: string) => void;
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [category, setCategory] = useState("Personal");
  const [dueDate, setDueDate] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    onAdd(text, priority, category, dueDate || undefined);

    // Reset fields
    setText("");
    setPriority("medium");
    setCategory("Personal");
    setDueDate("");
  };

  const categories = ["Work", "Personal", "Shopping", "Health", "Other"];

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a new task..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm md:text-base text-white placeholder-white/30 transition-all duration-300 focus:border-violet-500/80 focus:bg-white/[0.04] focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />
        </div>
        <button
          type="submit"
          disabled={!text.trim()}
          className="flex h-11 md:h-12 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 text-sm font-semibold text-white transition-all duration-300 hover:from-violet-500 hover:to-indigo-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] disabled:opacity-40 disabled:pointer-events-none"
        >
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">Add Task</span>
        </button>
      </div>

      {/* Advanced Toggle Button */}
      <div className="flex justify-between items-center px-1">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-violet-400/80 hover:text-violet-300 hover:underline transition-all duration-200"
        >
          {showAdvanced ? "Hide settings" : "Configure priority, category & date..."}
        </button>
      </div>

      {/* Advanced Settings Drawer */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          showAdvanced ? "max-h-48 opacity-100 py-2" : "max-h-0 opacity-0"
        }`}
      >
        <div className="grid grid-cols-1 gap-4 rounded-xl border border-white/5 bg-white/[0.01] p-4 sm:grid-cols-3">
          {/* Priority */}
          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <AlertCircle className="h-3.5 w-3.5" />
              Priority
            </label>
            <div className="flex gap-1.5 mt-1.5">
              {(["low", "medium", "high"] as const).map((p) => {
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium capitalize transition-all duration-200 ${
                      priority === p
                        ? p === "low"
                          ? "bg-slate-500/20 border-slate-500 text-slate-200"
                          : p === "medium"
                          ? "bg-amber-500/20 border-amber-500 text-amber-300"
                          : "bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.15)]"
                        : "bg-black/20 border-white/5 text-slate-400 hover:bg-white/[0.03]"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Tag className="h-3.5 w-3.5" />
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-slate-300">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Calendar className="h-3.5 w-3.5" />
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
            />
          </div>
        </div>
      </div>
    </form>
  );
}

"use client";

import React from "react";
import { CheckCircle2, ListTodo, Clock, Sparkles } from "lucide-react";
import { Todo } from "./TodoItem";

interface TodoStatsProps {
  todos: Todo[];
}

export default function TodoStats({ todos }: TodoStatsProps) {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Priority count of active/pending tasks
  const activeTodos = todos.filter((t) => !t.completed);
  const highPriorityCount = activeTodos.filter((t) => t.priority === "high").length;
  const mediumPriorityCount = activeTodos.filter((t) => t.priority === "medium").length;
  const lowPriorityCount = activeTodos.filter((t) => t.priority === "low").length;

  // Dynamic feedback messages
  const getMotivationalMessage = () => {
    if (total === 0) return "Add some tasks to jumpstart your day! 🚀";
    if (percentage === 100) return "Outstanding! You crushed all your goals! 🎉🏆";
    if (percentage >= 75) return "Almost there! Finish strong! 💪✨";
    if (percentage >= 50) return "Over the hump! Keep pushing! 🔥🌟";
    if (percentage >= 25) return "Great start! One step at a time. 👍🏃";
    return "Let's make some progress today! 🎯✨";
  };

  return (
    <div className="space-y-4">
      {/* Visual Completion Progress Bar */}
      <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-white/[0.01] p-5 shadow-[0_4px_30px_rgba(0,0,0,0.2)] backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-400 animate-pulse" />
            <h3 className="text-sm font-semibold text-slate-200">Task Completion Progress</h3>
          </div>
          <span className="text-lg font-bold text-violet-400 drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]">
            {percentage}%
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="h-3 w-full overflow-hidden rounded-full bg-white/[0.05] p-[1.5px]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 shadow-[0_0_12px_rgba(99,102,241,0.5)] transition-all duration-700 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="mt-3 text-xs text-slate-400 italic font-medium">{getMotivationalMessage()}</p>
      </div>

      {/* Numerical Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* Total Tasks Card */}
        <div className="rounded-xl border border-white/5 bg-white/[0.01] p-3 text-center transition-all hover:bg-white/[0.03]">
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 mb-1.5">
            <ListTodo className="h-4 w-4" />
          </div>
          <span className="block text-lg font-bold text-white leading-tight">{total}</span>
          <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Total</span>
        </div>

        {/* Completed Tasks Card */}
        <div className="rounded-xl border border-white/5 bg-white/[0.01] p-3 text-center transition-all hover:bg-white/[0.03]">
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 mb-1.5">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <span className="block text-lg font-bold text-white leading-tight">{completed}</span>
          <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Done</span>
        </div>

        {/* Pending Tasks Card */}
        <div className="rounded-xl border border-white/5 bg-white/[0.01] p-3 text-center transition-all hover:bg-white/[0.03]">
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 mb-1.5">
            <Clock className="h-4 w-4" />
          </div>
          <span className="block text-lg font-bold text-white leading-tight">{pending}</span>
          <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Pending</span>
        </div>
      </div>

      {/* Priority Breakdown of Pending Tasks */}
      {pending > 0 && (
        <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4">
          <h4 className="text-xs font-semibold text-slate-300 mb-3">Pending Tasks by Priority</h4>
          <div className="space-y-2">
            {/* High Priority Bar */}
            {highPriorityCount > 0 && (
              <div className="flex items-center gap-3">
                <span className="w-10 text-[10px] font-bold text-rose-400 uppercase">High</span>
                <div className="h-1.5 flex-1 rounded-full bg-white/[0.03] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.3)] transition-all duration-500"
                    style={{ width: `${(highPriorityCount / pending) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-300">{highPriorityCount}</span>
              </div>
            )}

            {/* Medium Priority Bar */}
            {mediumPriorityCount > 0 && (
              <div className="flex items-center gap-3">
                <span className="w-10 text-[10px] font-bold text-amber-400 uppercase">Medium</span>
                <div className="h-1.5 flex-1 rounded-full bg-white/[0.03] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)] transition-all duration-500"
                    style={{ width: `${(mediumPriorityCount / pending) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-300">{mediumPriorityCount}</span>
              </div>
            )}

            {/* Low Priority Bar */}
            {lowPriorityCount > 0 && (
              <div className="flex items-center gap-3">
                <span className="w-10 text-[10px] font-bold text-slate-400 uppercase">Low</span>
                <div className="h-1.5 flex-1 rounded-full bg-white/[0.03] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-slate-500 transition-all duration-500"
                    style={{ width: `${(lowPriorityCount / pending) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-300">{lowPriorityCount}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

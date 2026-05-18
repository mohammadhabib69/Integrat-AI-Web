"use client";

import React, { useState } from "react";
import { Trash2, Edit3, Check, Calendar, Tag, AlertCircle, Save, X } from "lucide-react";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  category: string;
  dueDate?: string;
  createdAt: number;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string, newPriority: "low" | "medium" | "high", newCategory: string, newDueDate?: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [editCategory, setEditCategory] = useState(todo.category);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate || "");

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText, editPriority, editCategory, editDueDate || undefined);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setEditPriority(todo.priority);
    setEditCategory(todo.category);
    setEditDueDate(todo.dueDate || "");
    setIsEditing(false);
  };

  // Style helpers
  const priorityColors = {
    low: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
    medium: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    high: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  };

  const categoryColors: Record<string, string> = {
    Work: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
    Personal: "bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20",
    Shopping: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    Health: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
    Other: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
  };

  const categories = ["Work", "Personal", "Shopping", "Health", "Other"];

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all duration-300 hover:border-violet-500/30 hover:bg-white/[0.04] hover:shadow-[0_0_20px_rgba(139,92,246,0.05)] ${
        todo.completed ? "opacity-60" : ""
      }`}
    >
      {/* Visual left bar for priority */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${
          todo.completed
            ? "bg-emerald-500/50"
            : todo.priority === "high"
            ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
            : todo.priority === "medium"
            ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
            : "bg-slate-600"
        }`}
      />

      {isEditing ? (
        <div className="space-y-4 pl-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-white/30 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              placeholder="Edit task..."
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Priority</label>
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value as "low" | "medium" | "high")}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-white focus:border-violet-500 focus:outline-none"
              >
                <option value="low" className="bg-slate-900 text-slate-300">Low</option>
                <option value="medium" className="bg-slate-900 text-amber-400">Medium</option>
                <option value="high" className="bg-slate-900 text-rose-400">High</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Category</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-white focus:border-violet-500 focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900 text-slate-300">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Due Date</label>
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs text-white focus:border-violet-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 rounded-lg border border-white/10 bg-transparent px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/5 transition-all duration-200"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 rounded-lg bg-violet-600 hover:bg-violet-500 px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
            >
              <Save className="h-3.5 w-3.5" />
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 pl-2">
          {/* Custom Checkbox */}
          <button
            onClick={() => onToggle(todo.id)}
            className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-300 ${
              todo.completed
                ? "border-emerald-500 bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                : "border-white/20 bg-transparent hover:border-violet-500/70 hover:shadow-[0_0_8px_rgba(139,92,246,0.2)]"
            }`}
          >
            {todo.completed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
          </button>

          {/* Todo Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-2">
              <span
                className={`text-sm md:text-base font-medium break-words leading-relaxed transition-all duration-300 ${
                  todo.completed ? "text-slate-500 line-through" : "text-slate-100"
                }`}
              >
                {todo.text}
              </span>

              {/* Badges / Meta Info */}
              <div className="flex flex-wrap gap-2 items-center">
                <span
                  className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${
                    priorityColors[todo.priority]
                  }`}
                >
                  <AlertCircle className="h-2.5 w-2.5" />
                  {todo.priority}
                </span>

                <span
                  className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold tracking-wide ${
                    categoryColors[todo.category] || categoryColors.Other
                  }`}
                >
                  <Tag className="h-2.5 w-2.5" />
                  {todo.category}
                </span>

                {todo.dueDate && (
                  <span className="inline-flex items-center gap-1 rounded border border-white/5 bg-white/[0.02] px-2 py-0.5 text-[10px] font-medium text-slate-400">
                    <Calendar className="h-2.5 w-2.5" />
                    {new Date(todo.dueDate).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-indigo-400 transition-all duration-200"
              title="Edit Task"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-rose-400 transition-all duration-200"
              title="Delete Task"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  SlidersHorizontal,
  Trash2,
  CheckSquare,
  Sparkles,
  RefreshCw,
  FolderKanban,
} from "lucide-react";
import TodoItem, { Todo } from "./TodoItem";
import TodoForm from "./TodoForm";
import TodoStats from "./TodoStats";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";

const LOCAL_STORAGE_KEY = "antigravity-premium-todos";

const DEFAULT_TODOS: Todo[] = [
  {
    id: "1",
    text: "🚀 Build a premium modern Todo application in Next.js v16 & Tailwind v4",
    completed: true,
    priority: "high",
    category: "Work",
    dueDate: new Date().toISOString().split("T")[0],
    createdAt: Date.now() - 3600000 * 24,
  },
  {
    id: "2",
    text: "🎨 Implement sleek glassmorphism dashboard cards and cosmic gradients",
    completed: false,
    priority: "high",
    category: "Personal",
    dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    createdAt: Date.now() - 3600000 * 12,
  },
  {
    id: "3",
    text: "🛡️ Audit typescript compilation and Next.js hydration safety",
    completed: false,
    priority: "medium",
    category: "Work",
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    createdAt: Date.now() - 3600000 * 2,
  },
  {
    id: "4",
    text: "🛒 Purchase organic groceries and matcha dark chocolate",
    completed: false,
    priority: "low",
    category: "Shopping",
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
    createdAt: Date.now(),
  },
];

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);

  // Keep a ref of todos to avoid stale closures in CopilotKit action handlers
  const todosRef = useRef<Todo[]>(todos);
  useEffect(() => {
    todosRef.current = todos;
  }, [todos]);

  const [mounted, setMounted] = useState(false);

  // Filter & Search state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "completed">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "dueDate" | "priority">("newest");
  const [showFilters, setShowFilters] = useState(false);

  // --- CopilotKit Real-time Reading Context ---
  useCopilotReadable({
    description: "The user's list of todo tasks. Each task has: id (string), text (string), completed (boolean), priority ('low' | 'medium' | 'high'), category (string), and optional dueDate (string, format YYYY-MM-DD).",
    value: todos,
  }, [todos]);

  // --- CopilotKit AI Actions (Writing Context) ---
  useCopilotAction({
    name: "addTodo",
    description: "Adds a new todo task to the todo list.",
    parameters: [
      {
        name: "text",
        type: "string",
        description: "The description text of the todo task to be added.",
        required: true,
      },
      {
        name: "priority",
        type: "string",
        description: "The priority level of the task. Must be 'high', 'medium', or 'low'. Defaults to 'medium'.",
        enum: ["high", "medium", "low"],
        required: false,
      },
      {
        name: "category",
        type: "string",
        description: "The category of the task (e.g. Work, Personal, Shopping, Health, Other). Defaults to 'Other'.",
        required: false,
      },
      {
        name: "dueDate",
        type: "string",
        description: "The optional due date of the task in YYYY-MM-DD format.",
        required: false,
      },
    ],
    handler: async ({ text, priority, category, dueDate }) => {
      handleAddTodo(
        text,
        (priority as "low" | "medium" | "high") || "medium",
        category || "Other",
        dueDate
      );
    },
  }, []);

  useCopilotAction({
    name: "toggleTodo",
    description: "Toggles the completed status of a todo task (marks a completed task as active, or an active task as completed).",
    parameters: [
      {
        name: "id",
        type: "string",
        description: "The unique ID of the todo task to toggle.",
        required: false,
      },
      {
        name: "textQuery",
        type: "string",
        description: "An optional search text query to find the task to toggle if the ID is not explicitly known.",
        required: false,
      },
    ],
    handler: async ({ id, textQuery }) => {
      let targetId = id;
      if (!targetId && textQuery) {
        const found = todosRef.current.find((t) =>
          t.text.toLowerCase().includes(textQuery.toLowerCase())
        );
        if (found) targetId = found.id;
      }
      if (targetId) {
        handleToggleTodo(targetId);
      }
    },
  }, []);

  useCopilotAction({
    name: "deleteTodo",
    description: "Removes or deletes a todo task from the list.",
    parameters: [
      {
        name: "id",
        type: "string",
        description: "The unique ID of the todo task to delete.",
        required: false,
      },
      {
        name: "textQuery",
        type: "string",
        description: "An optional search text query to find the task to delete if the ID is not explicitly known.",
        required: false,
      },
    ],
    handler: async ({ id, textQuery }) => {
      let targetId = id;
      if (!targetId && textQuery) {
        const found = todosRef.current.find((t) =>
          t.text.toLowerCase().includes(textQuery.toLowerCase())
        );
        if (found) targetId = found.id;
      }
      if (targetId) {
        handleDeleteTodo(targetId);
      }
    },
  }, []);

  useCopilotAction({
    name: "deleteTodos",
    description: "Removes or deletes multiple todo tasks from the list based on status (e.g. active, completed, or all), category, priority, or search text.",
    parameters: [
      {
        name: "status",
        type: "string",
        description: "Optional status to filter by. Can be 'active' (to delete only incomplete tasks), 'completed' (to delete only completed tasks), or 'all' (to delete all tasks).",
        enum: ["active", "completed", "all"],
        required: false,
      },
      {
        name: "category",
        type: "string",
        description: "Optional category to filter by (e.g. Work, Personal, Shopping, Health, Other). Tasks matching this category will be deleted.",
        required: false,
      },
      {
        name: "priority",
        type: "string",
        description: "Optional priority to filter by ('high', 'medium', 'low'). Tasks matching this priority will be deleted.",
        enum: ["high", "medium", "low"],
        required: false,
      },
      {
        name: "textQuery",
        type: "string",
        description: "Optional search text query. Tasks containing this text in their description will be deleted.",
        required: false,
      },
    ],
    handler: async ({ status, category, priority, textQuery }) => {
      setTodos((prev) => {
        // If no parameters are provided at all, do nothing to prevent accidental deletions
        if (!status && !category && !priority && !textQuery) {
          return prev;
        }

        return prev.filter((todo) => {
          let matchesCriteria = true;

          if (status) {
            if (status === "active" && todo.completed) matchesCriteria = false;
            if (status === "completed" && !todo.completed) matchesCriteria = false;
            // 'all' matches everything
          }
          if (category && todo.category.toLowerCase() !== category.toLowerCase()) {
            matchesCriteria = false;
          }
          if (priority && todo.priority !== priority) {
            matchesCriteria = false;
          }
          if (textQuery && !todo.text.toLowerCase().includes(textQuery.toLowerCase())) {
            matchesCriteria = false;
          }

          // If it matches all specified criteria, delete it (filter it out by returning false)
          return !matchesCriteria;
        });
      });
    },
  }, []);

  useCopilotAction({
    name: "editTodo",
    description: "Edits or updates an existing todo task's text, priority, category, or due date.",
    parameters: [
      {
        name: "id",
        type: "string",
        description: "The unique ID of the todo task to edit.",
        required: false,
      },
      {
        name: "textQuery",
        type: "string",
        description: "An optional search text query to find the task to edit if the ID is not explicitly known.",
        required: false,
      },
      {
        name: "newText",
        type: "string",
        description: "The updated description text for the task.",
        required: false,
      },
      {
        name: "newPriority",
        type: "string",
        description: "The updated priority level for the task. Must be 'high', 'medium', or 'low'.",
        enum: ["high", "medium", "low"],
        required: false,
      },
      {
        name: "newCategory",
        type: "string",
        description: "The updated category for the task.",
        required: false,
      },
      {
        name: "newDueDate",
        type: "string",
        description: "The updated due date in YYYY-MM-DD format.",
        required: false,
      },
    ],
    handler: async ({ id, textQuery, newText, newPriority, newCategory, newDueDate }) => {
      let targetTodo = todosRef.current.find((t) => t.id === id);
      if (!targetTodo && textQuery) {
        targetTodo = todosRef.current.find((t) =>
          t.text.toLowerCase().includes(textQuery.toLowerCase())
        );
      }
      if (targetTodo) {
        handleEditTodo(
          targetTodo.id,
          newText !== undefined ? newText : targetTodo.text,
          (newPriority as "low" | "medium" | "high") !== undefined
            ? (newPriority as "low" | "medium" | "high")
            : targetTodo.priority,
          newCategory !== undefined ? newCategory : targetTodo.category,
          newDueDate !== undefined ? newDueDate : targetTodo.dueDate
        );
      }
    },
  }, []);

  useCopilotAction({
    name: "clearCompletedTodos",
    description: "Clears or deletes all completed tasks from the list.",
    parameters: [],
    handler: async () => {
      handleClearCompleted();
    },
  }, []);

  useCopilotAction({
    name: "setFiltersAndSearch",
    description: "Sets the search text filter, status filters, category filter, or priority filter in the UI.",
    parameters: [
      {
        name: "searchText",
        type: "string",
        description: "Search text query to match task content. Pass empty string to clear.",
        required: false,
      },
      {
        name: "status",
        type: "string",
        description: "Filter by status: 'all', 'active', or 'completed'.",
        enum: ["all", "active", "completed"],
        required: false,
      },
      {
        name: "category",
        type: "string",
        description: "Filter by category (e.g. Work, Personal, Shopping, Health, Other, or 'all').",
        required: false,
      },
      {
        name: "priority",
        type: "string",
        description: "Filter by priority level ('high', 'medium', 'low', or 'all').",
        enum: ["high", "medium", "low", "all"],
        required: false,
      },
    ],
    handler: async ({ searchText, status, category, priority }) => {
      if (searchText !== undefined) setSearch(searchText);
      if (status !== undefined) setStatusFilter(status as "all" | "active" | "completed");
      if (category !== undefined) setCategoryFilter(category);
      if (priority !== undefined) setPriorityFilter(priority);
      if ((category !== undefined && category !== "all") || (priority !== undefined && priority !== "all")) {
        setShowFilters(true);
      }
    },
  }, []);

  // Load from local storage
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setTodos(JSON.parse(stored));
      } else {
        setTodos(DEFAULT_TODOS);
      }
    } catch (e) {
      console.error("Failed to load todos from localStorage", e);
      setTodos(DEFAULT_TODOS);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
    } catch (e) {
      console.error("Failed to save todos to localStorage", e);
    }
  }, [todos, mounted]);

  // Handle Operations
  const handleAddTodo = (
    text: string,
    priority: "low" | "medium" | "high",
    category: string,
    dueDate?: string
  ) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      priority,
      category,
      dueDate,
      createdAt: Date.now(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleEditTodo = (
    id: string,
    newText: string,
    newPriority: "low" | "medium" | "high",
    newCategory: string,
    newDueDate?: string
  ) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              text: newText,
              priority: newPriority,
              category: newCategory,
              dueDate: newDueDate,
            }
          : todo
      )
    );
  };

  const handleClearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  const handleResetDemo = () => {
    setTodos(DEFAULT_TODOS);
  };

  // Helper arrays
  const categories = ["Work", "Personal", "Shopping", "Health", "Other"];

  // Filtering & Sorting logic
  const filteredTodos = todos
    .filter((todo) => {
      // 1. Search text
      const matchesSearch = todo.text.toLowerCase().includes(search.toLowerCase());

      // 2. Status
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "completed"
          ? todo.completed
          : !todo.completed;

      // 3. Category
      const matchesCategory = categoryFilter === "all" ? true : todo.category === categoryFilter;

      // 4. Priority
      const matchesPriority = priorityFilter === "all" ? true : todo.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return b.createdAt - a.createdAt;
      }
      if (sortBy === "dueDate") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === "priority") {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return 0;
    });

  // If not mounted (Server Side rendering) show skeleton loaders to preserve layout
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-violet-500" />
          <span className="text-sm font-semibold tracking-wider text-slate-400">
            Initializing workspace...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-slate-950 text-slate-100 py-10 px-4 md:px-8">
      {/* Decorative floating blur backgrounds */}
      <div className="pointer-events-none absolute left-1/4 top-10 h-72 w-72 rounded-full bg-violet-600/10 blur-[100px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-[100px]" />

      <div className="mx-auto max-w-5xl">
        {/* Header Branding */}
        <header className="mb-10 text-center">
          <div className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/5 px-4 py-1.5 mb-3 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-violet-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-violet-300">
              Next-Gen Task Planner
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
            AETHER <span className="text-violet-400">TODO</span>
          </h1>
          <p className="mt-2.5 text-sm md:text-base text-slate-400">
            Organize work, manage goals, and clear your mind with a premium aesthetic canvas.
          </p>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          
          {/* Left panel: Form, Stats */}
          <section className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-md">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-violet-400" />
                Quick Create
              </h2>
              <TodoForm onAdd={handleAddTodo} />
            </div>

            <TodoStats todos={todos} />
          </section>

          {/* Right panel: Main Todo List */}
          <section className="lg:col-span-8 rounded-2xl border border-white/5 bg-white/[0.02] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-md space-y-6">
            
            {/* Search, Filter bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              
              {/* Search bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tasks..."
                  className="w-full rounded-xl border border-white/5 bg-white/[0.02] py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-white/30 focus:border-violet-500/50 focus:bg-white/[0.04] focus:outline-none"
                />
              </div>

              {/* Action utilities */}
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-300 ${
                    showFilters || categoryFilter !== "all" || priorityFilter !== "all"
                      ? "border-violet-500/40 bg-violet-500/10 text-violet-300"
                      : "border-white/5 bg-white/[0.02] text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Filters
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "newest" | "dueDate" | "priority")}
                  className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5 focus:outline-none"
                >
                  <option value="newest" className="bg-slate-900">Newest</option>
                  <option value="dueDate" className="bg-slate-900">Due Date</option>
                  <option value="priority" className="bg-slate-900">Priority</option>
                </select>
              </div>

            </div>

            {/* Collapsible Advanced Filters Row */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                showFilters ? "max-h-48 sm:max-h-24 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
              }`}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 rounded-xl border border-white/5 bg-white/[0.01] p-4">
                
                {/* Filter by Category */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Category
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full rounded-lg border border-white/5 bg-slate-900 px-2 py-1.5 text-xs text-slate-200"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filter by Priority */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Priority
                  </label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full rounded-lg border border-white/5 bg-slate-900 px-2 py-1.5 text-xs text-slate-200"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

              </div>
            </div>

            {/* List Header and Status Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4">
              
              {/* Status Pills */}
              <div className="flex rounded-lg bg-black/40 p-1 border border-white/5 self-start">
                {(["all", "active", "completed"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-md px-3.5 py-1 text-xs font-semibold capitalize transition-all duration-200 ${
                      statusFilter === status
                        ? "bg-violet-600 text-white shadow-md shadow-violet-600/25"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* Utility Cleans */}
              <div className="flex gap-2">
                {todos.some((t) => t.completed) && (
                  <button
                    onClick={handleClearCompleted}
                    className="flex items-center gap-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 hover:underline transition-all duration-200 px-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Clear completed
                  </button>
                )}
                <button
                  onClick={handleResetDemo}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-300 hover:underline transition-all duration-200 px-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  Seed Demo
                </button>
              </div>

            </div>

            {/* Todo Items Feed */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredTodos.length > 0 ? (
                filteredTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggleTodo}
                    onDelete={handleDeleteTodo}
                    onEdit={handleEditTodo}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.02] border border-white/5 text-slate-500 mb-4 animate-bounce">
                    <FolderKanban className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-300">No tasks matched</h3>
                  <p className="mt-1 max-w-xs text-xs text-slate-400 leading-relaxed">
                    Try adjusting your filters, searching for another keyword, or adding a new task above!
                  </p>
                </div>
              )}
            </div>

            {/* Total Count footer */}
            <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-white/5">
              <span>
                Showing {filteredTodos.length} of {todos.length} items
              </span>
              <span>Local Database Active</span>
            </div>

          </section>

        </div>
      </div>
    </div>
  );
}

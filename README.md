# 🌌 Aether Todo — Premium AI-Assisted Task Dashboard

Aether Todo is a next-generation, high-fidelity task planner built using **Next.js 16 (App Router)**, **Tailwind CSS v4**, and **TypeScript**, seamlessly integrated with **CopilotKit** and powered by the **Google Gemini 1.5 Flash** model. 

It provides an exquisite user experience with modern glassmorphism components, cosmic gradients, high-contrast aesthetics, real-time motivational progress metrics, and a fully functional floating AI assistant that can read, write, filter, and modify your tasks via natural language.

---

## 🌟 Key Features

### 🎨 1. Premium Visual Design
- **Cosmic Dark Mode Aesthetics**: Rich indigo and violet deep radial gradients with subtle animated glow panels.
- **Glassmorphic Cards**: Sophisticated translucent panels built using CSS backdrop blurs and micro-border styling.
- **Interactive UI Feedback**: Smooth hover animations, status tabs, collapsible advanced filters drawer, and a live task progress completion meter.

### 🧠 2. Deep CopilotKit Integration
- **Real-Time State Awareness**: Automatically exposes the entire active task state to the AI model (`useCopilotReadable`).
- **Natural Language Actions (`useCopilotAction`)**:
  - `addTodo`: Instantly create tasks with dynamic priority levels, category tagging, and automated due-date parsing.
  - `toggleTodo`: Instantly complete or activate tasks by name or ID.
  - `deleteTodo`: Remove single tasks from the dashboard.
  - `editTodo`: Edit text, priorities, categories, and due dates on the fly.
  - `clearCompletedTodos`: Effortlessly clean up completed work.
  - `setFiltersAndSearch`: Search and filter tasks using voice or text prompts (e.g. *"Show me only high priority tasks"*).
- **Floating AI Assistant Panel**: Equipped with `<CopilotPopup>` for high-context natural interactions.

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js (v18.x or newer)** installed.

### 2. Install Dependencies
Clone the repository and install the standard dependencies:
```bash
npm install
```

### 3. Environment Variable Setup
Ensure you have the `.env.local` file configured in the root directory. CopilotKit uses this key to communicate directly with the Gemini API.

Create `.env.local`:
```env
GOOGLE_API_KEY=AIzaSyCYnjHIevXgb8Zj_d9HTZD-8wJw4v-WpYY
```

### 4. Run the Development Server
Launch the application:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience Aether Todo.

---

## 📁 Project Architecture & Components

```
├── app/
│   ├── api/
│   │   └── copilotkit/
│   │       └── route.ts       # Backend Runtime & Gemini Adapter endpoint
│   ├── globals.css            # Tailwind CSS v4 & custom variables
│   ├── layout.tsx             # CopilotKit Context & Popup wrapper
│   └── page.tsx               # Main Dashboard entry point
├── components/
│   ├── TodoApp.tsx            # Main state manager, filtering, sorting, & CopilotKit hooks
│   ├── TodoForm.tsx           # Premium Task Creation (includes priority/category/due-date selectors)
│   ├── TodoItem.tsx           # Individual task renderer (with inline editing, hover utility options)
│   └── TodoStats.tsx          # Numerical stats, motivational feedback, priority progress metrics
├── package.json               # Next.js 16 + React 19 + CopilotKit dependencies
└── tsconfig.json              # TypeScript compilation rules
```

---

## 🛠️ Complete Verification & Build Quality
The application has been verified for production readiness using rigorous local quality tests:

- **Linting & Code Standards Check**: Verified successfully via `npm run lint` with zero errors or warnings.
- **Strict Type Checking**: Verified successfully via `npx tsc --noEmit` with clean compilation.
- **Production Build compilation**: Tested and passed using `npm run build` compiling statically optimized endpoints in Turbopack successfully.

---

## 💡 Example AI Prompts to Try
Click on the **Aether Copilot** floating button in the bottom right corner and try:
* 📝 *"Add a high priority task under Work category called 'Refactor authentication layout' due tomorrow."*
* 🔍 *"Search my tasks for 'Matcha' and filter them."*
* 🏷️ *"Mark the grocery shopping task as completed."*
* 🗑️ *"Delete all of my completed tasks."*
* ⚙️ *"Show me all high priority tasks."*

Enjoy managing your life with a gorgeous aesthetic workspace! 🌌

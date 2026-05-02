# Harness Engineering Studio

Harness Engineering Studio is a specialized IDE designed for building and refining **Problem-Solving Agent Routines**. It provides a structured environment to design agent "skills" and "harnesses" (governance and state management layers) to ensure reliable, evidence-driven AI execution.

## Key Features

- **Routine Builder**: Design sequential multi-loop problem-solving steps (Intake, Planning, Execution, Evaluation, Handoff).
- 🛠️ **Harness Composer**: Mix and match harness patterns (Artifact Registry, Tool Sandbox, Human Gate, etc.) to stabilize AI execution.
- 🌍 **Multi-Language Support**: Seamlessly switch between **English, Chinese, and Japanese** with a floating UI switcher.
- 💾 **State Persistence**: Remembers your inputs and last used language across sessions.
- 📦 **Artifact Workbench**: Instant generation of `brief.md`, `plan.md`, `constraints.json`, and more.
- **Dynamic Recommendations**: Automatically suggests the best combination of skills and harness patterns based on problem complexity and risk level.
- **Execution Runbook**: Provides a clear map of the runtime loop and selected harness stack.

## Tech Stack

- **Framework**: [React](https://reactjs.org/)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository (or extract the files).
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the development server:
   ```bash
   npm run dev
   ```

The application will be available at the URL provided in the terminal (usually `http://localhost:5173`).

## Project Structure

- `index.html`: Main entry point.
- `src/main.jsx`: React application entry point.
- `src/App.jsx`: The core Harness Engineering Studio component.
- `src/index.css`: Global styles and Tailwind directives.
- `package.json`: Project dependencies and scripts.
- `vite.config.js`: Vite configuration.
- `tailwind.config.js`: Tailwind CSS configuration.

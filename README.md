<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Monaco_Editor-4-007ACC?logo=visualstudiocode&logoColor=white" alt="Monaco Editor" />
  <img src="https://img.shields.io/badge/Netlify-Deploy-00C7B7?logo=netlify&logoColor=white" alt="Netlify" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

<h1 align="center">CompileX</h1>

<p align="center">
  <strong>A sleek, feature-rich multi-language online compiler with AI-powered code suggestions and instant sharing.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> &bull;
  <a href="#supported-languages">Languages</a> &bull;
  <a href="#getting-started">Getting Started</a> &bull;
  <a href="#project-structure">Architecture</a> &bull;
  <a href="#deployment">Deployment</a>
</p>

---

## Overview

CompileX is a modern browser-based IDE that lets you write, compile, and run code in **10+ programming languages** without any local setup. Built with React and powered by the Monaco Editor (the same editor behind VS Code), it delivers a familiar, professional coding experience right in your browser.

Whether you're quickly prototyping an algorithm, testing a snippet in an unfamiliar language, or sharing code with a colleague, CompileX provides a polished, zero-friction environment to get the job done.

---

## Features

- **Multi-Language Compilation** — Run code in JavaScript, TypeScript, Python, Java, C, C++, Go, Rust, Ruby, and PHP through a unified interface.
- **Monaco-Powered Editor** — Full-featured code editor with syntax highlighting, IntelliSense, code folding, font ligatures, and smooth caret animations.
- **AI Code Suggestions** — Toggle AI-powered suggestions (via HuggingFace's StarCoder model) to receive real-time improvements, best-practice tips, and performance optimizations.
- **One-Click Code Sharing** — Share any code snippet instantly via GitHub Gists. A shareable link is copied to your clipboard automatically.
- **Draft Management** — Save up to 20 code drafts locally. Load or delete previous work with a single click.
- **Customizable Workspace** — Switch between Dark, Light, and High Contrast themes. Adjust font size between 12px and 20px. Toggle a collapsible sidebar for a distraction-free editor.
- **Responsive & Animated UI** — Glassmorphism design with Framer Motion animations, smooth sidebar transitions, and a gradient-accented dark interface.
- **PWA-Ready** — Includes a web app manifest for standalone, app-like installation on supported browsers.
- **Keyboard Shortcuts** — `Ctrl+Enter` to run code, `Ctrl+S` to save a draft, `Ctrl+Space` for AI suggestions.
- **Real-Time Output** — Color-coded output panel distinguishes successful execution from compilation and runtime errors. Copy output or clear the terminal in one click.

---

## Supported Languages

| Language    | ID | Extension |
|-------------|----|-----------|
| JavaScript  | 63 | `.js`     |
| TypeScript  | 74 | `.ts`     |
| Python      | 71 | `.py`     |
| Java        | 62 | `.java`   |
| C           | 50 | `.c`      |
| C++         | 54 | `.cpp`    |
| Go          | 60 | `.go`     |
| Rust        | 73 | `.rs`     |
| Ruby        | 72 | `.rb`     |
| PHP         | 68 | `.php`    |

---

## Tech Stack

| Layer            | Technology                                  |
|------------------|---------------------------------------------|
| **Frontend**     | React 18, Vite 5                            |
| **Editor**       | Monaco Editor (`@monaco-editor/react`)      |
| **Styling**      | Tailwind CSS 3, PostCSS, custom CSS          |
| **State**        | Zustand                                     |
| **Animation**    | Framer Motion                               |
| **Icons**        | Lucide React                                |
| **Notifications**| React Hot Toast                            |
| **UI Selects**   | React Select                                |
| **Backend**      | Netlify Functions (serverless)              |
| **Code Execution**| Judge0 CE (via RapidAPI) — prod, Piston API — dev |
| **AI Suggestions**| HuggingFace Inference API (StarCoder)     |
| **Code Sharing** | GitHub Gists API (via Octokit)              |

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9

### Installation

```bash
# Clone the repository
git clone https://github.com/Danyalkhattak/compilex.git
cd compilex

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

> **Development Mode:** In dev mode, code execution uses the free [Piston API](https://github.com/engineer-man/piston) — no API keys required. Code sharing falls back to a mock, and AI suggestions return sample data.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Environment Variables (Production)

To enable all features in production (Judge0 execution, GitHub Gist sharing, AI suggestions), set the following environment variables in your Netlify dashboard or `.env` file:

| Variable              | Description                                | Required |
|-----------------------|--------------------------------------------|----------|
| `RAPIDAPI_KEY`        | RapidAPI key for Judge0 CE code execution  | Yes      |
| `GITHUB_TOKEN`        | GitHub personal access token for Gist creation | Yes   |
| `HUGGINGFACE_API_KEY` | HuggingFace API key for StarCoder inference | No (fallback suggestions shown if absent) |

---

## Project Structure

```
compilex/
├── public/
│   ├── favicon.svg          # App icon (SVG)
│   ├── manifest.json        # PWA manifest
│   └── test.html            # Standalone test page
├── src/
│   ├── components/
│   │   ├── Header.jsx       # Top navigation bar with logo, feature badges, and GitHub link
│   │   ├── CodeEditor.jsx   # Monaco Editor wrapper with run/save/AI controls
│   │   ├── OutputPanel.jsx  # Terminal-style output display with copy/clear
│   │   └── Sidebar.jsx      # Collapsible sidebar: language, settings, share, drafts
│   ├── services/
│   │   └── api.js           # API client: code execution, sharing, AI suggestions
│   ├── store/
│   │   └── appStore.js      # Zustand global state (editor, output, drafts, UI)
│   ├── App.jsx              # Root layout: header + sidebar + editor + output
│   ├── main.jsx             # React entry point with toast provider
│   └── index.css            # Tailwind layers + custom glass-effect utilities
├── netlify/
│   └── functions/
│       ├── runCode.js       # Serverless: execute code via Judge0 CE
│       ├── shareCode.js     # Serverless: create GitHub Gist for sharing
│       ├── getSuggestions.js# Serverless: fetch AI code suggestions
│       ├── health.js        # Serverless: health check endpoint
│       └── package.json     # Function dependencies
├── index.html               # HTML entry with JetBrains Mono font
├── vite.config.js           # Vite config with Monaco vendor chunking
├── tailwind.config.js       # Custom dark theme palette + animations
├── postcss.config.js        # PostCSS with Tailwind + Autoprefixer
├── netlify.toml             # Netlify build config, redirects, dev settings
└── package.json             # Project metadata and scripts
```

---

## Key Architecture Decisions

### Dual Execution Mode
The app gracefully handles both development and production environments. During development, it routes code execution requests to the free Piston API at `emkc.org`, requiring zero configuration. In production, it delegates to a Netlify serverless function that proxies requests to the Judge0 CE API via RapidAPI, supporting a wider range of languages and higher reliability. This dual-path design means developers can start contributing immediately without acquiring API keys.

### Serverless Backend
All backend logic lives in Netlify Functions, keeping the project entirely serverless with no infrastructure to manage. The `netlify.toml` configuration handles API routing (`/api/*` → `/.netlify/functions/:splat`), SPA redirects, and build settings in a single declarative file. Each function is independently deployable and only loads the dependencies it needs via esbuild bundling.

### Client-Side State with Zustand
Global application state is managed through a single Zustand store (`appStore.js`) that holds editor content, language selection, theme preferences, output results, AI suggestion flags, shared links, and saved drafts. This lightweight approach avoids the boilerplate of Redux while providing a clean, composable state management pattern that integrates naturally with React hooks.

### AI Suggestions with Graceful Degradation
The AI suggestion feature uses HuggingFace's StarCoder model for code-aware completions. When the API is unavailable, rate-limited, or the feature is disabled, the system returns meaningful fallback suggestions (best practices, performance tips) so the user experience is never broken.

---

## Deployment

### Netlify (Recommended)

1. Push the repository to GitHub.
2. Connect the repo in the [Netlify dashboard](https://app.netlify.com/).
3. Set the build command to `npm run build` and publish directory to `dist`.
4. Add the environment variables listed above under **Site settings → Environment variables**.
5. Deploy.

Netlify auto-detects `netlify.toml` and handles function deployment, API routing, and SPA rewrites.

---

## Scripts

| Command           | Description                              |
|-------------------|------------------------------------------|
| `npm run dev`     | Start the Vite dev server on port 3000   |
| `npm run build`   | Production build to `dist/`              |
| `npm run preview` | Preview the production build locally     |
| `npm run lint`    | Lint source files with ESLint            |

---

## Contributing

Contributions are welcome! To get started:

1. Fork this repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request.

Please ensure your code passes the linter before submitting (`npm run lint`).

---

## Author

**Danyal Khattak** — [GitHub](https://github.com/Danyalkhattak)

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
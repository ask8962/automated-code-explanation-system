# Automated Code Explanation System 🚀

> **GLA University Mini Project - B.Tech CSE (3rd Year)**
> *Empowering students to understand and optimize code instantly using AI.*

![Project Badge](https://img.shields.io/badge/Status-Complete-green)
![Tech](https://img.shields.io/badge/Built%20With-Next.js%2014-black)
![AI](https://img.shields.io/badge/AI-Llama%203.3-purple)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node](https://img.shields.io/badge/Node.js-18%2B-339933)
![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%7C%20Auth-FFCA28)

---

## 📖 Overview

The **Automate Code Explanation System** is an AI-powered educational platform designed to help students and developers understand complex code snippets in seconds. By leveraging advanced Large Language Models (LLMs) — specifically **Llama 3.3 70B via Groq** — it provides:

- Instant, structured **line-by-line code explanations**
- **Time & Space complexity analysis** with visual comparison cards
- One-click **performance optimization** suggestions (e.g., rewriting O(n²) code into O(n log n))
- **Flowchart generation** from code logic using Mermaid diagrams
- **Shareable explanation links** for collaborative learning

The system is available as a **web application**, a **Chrome browser extension**, and a **VS Code editor extension** — meeting developers wherever they work.

## ✨ Key Features

| Feature | Description |
|:--------|:------------|
| **🤖 AI-Powered Explanations** | Paste code in Python, Java, C++, C, JavaScript, or PHP and get a detailed, structured breakdown instantly |
| **⚡ "Make it Faster" Mode** | One-click optimization that rewrites inefficient O(n²) code into efficient O(n) or O(n log n) solutions with side-by-side comparison |
| **📊 Complexity Analysis** | Visual cards comparing Time and Space complexity before and after optimization |
| **🔀 Flowchart Generation** | Automatically generates visual flowcharts from your code logic using Mermaid diagrams |
| **🔗 Shareable Links** | Generate public shareable links for any explanation to collaborate with peers |
| **📜 History Tracking** | Saves all your explanations for future reference, stored securely in Firebase Firestore |
| **🔐 Google Authentication** | Secure sign-in via Google OAuth through Firebase Auth |
| **🎨 Premium UI/UX** | Clean, card-based interface with syntax highlighting, glassmorphism design, dark/light mode, and smooth animations |
| **🌐 Chrome Extension** | Explain code directly from GitHub, LeetCode, and StackOverflow without leaving the page |
| **💻 VS Code Extension** | Right-click any selected code in VS Code to get AI explanations and optimizations inline |
| **📱 Responsive Design** | Fully responsive layout that works beautifully on desktop, tablet, and mobile devices |
| **📄 Export to PDF** | Download your code explanations as beautifully formatted PDF documents |

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|:-----------|:--------|
| **Next.js 14** | React framework with App Router, SSR, and API routes |
| **React 18** | Component-based UI library |
| **Tailwind CSS** | Utility-first CSS framework for rapid styling |
| **Shadcn UI** | Accessible, customizable UI component library (Radix UI primitives) |
| **Framer Motion** | Smooth animations and page transitions |
| **Monaco Editor** | VS Code's editor component for syntax-highlighted code input |
| **Mermaid.js** | Flowchart and diagram rendering from code logic |
| **React Three Fiber** | 3D scene rendering for the landing page hero section |
| **Lucide Icons** | Beautiful, consistent icon library |

### Backend & AI
| Technology | Purpose |
|:-----------|:--------|
| **Groq API** | Ultra-fast LLM inference (Llama 3.3 70B Versatile) |
| **Vercel AI SDK** | Streaming AI responses with React hooks |
| **Next.js API Routes** | `/api/explain`, `/api/optimize`, `/api/flowchart` endpoints |

### Database & Auth
| Technology | Purpose |
|:-----------|:--------|
| **Firebase Firestore** | NoSQL database for storing explanation history |
| **Firebase Auth** | Google OAuth authentication |
| **Firestore Security Rules** | Role-based access control for user data |

### Deployment
| Technology | Purpose |
|:-----------|:--------|
| **Vercel** | Production hosting with edge functions |
| **GitHub** | Source control and CI/CD integration |

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
├──────────────┬──────────────────┬───────────────────────────────┤
│  Web App     │ Chrome Extension │   VS Code Extension           │
│  (Next.js)   │ (Manifest V3)    │   (TypeScript)                │
└──────┬───────┴────────┬─────────┴──────────┬────────────────────┘
       │                │                    │
       ▼                ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API LAYER (Next.js Routes)                  │
├──────────────┬──────────────────┬───────────────────────────────┤
│ /api/explain │  /api/optimize   │   /api/flowchart              │
└──────┬───────┴────────┬─────────┴──────────┬────────────────────┘
       │                │                    │
       ▼                ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AI LAYER (Groq)                            │
│              Llama 3.3 70B Versatile Model                      │
└─────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATA LAYER (Firebase)                         │
├─────────────────────────┬───────────────────────────────────────┤
│   Firestore Database    │       Firebase Auth                   │
│   (Explanation History) │       (Google OAuth)                  │
└─────────────────────────┴───────────────────────────────────────┘
```

## 🌐 Chrome Extension

The Chrome extension brings AI code explanations directly into your browser. It works seamlessly on popular developer websites.

### Supported Websites
- **GitHub** — Explain code in repositories, pull requests, and gists
- **LeetCode** — Understand problem solutions and editorial code
- **StackOverflow** — Get explanations for code snippets in answers

### How It Works
1. Navigate to any supported website with code blocks
2. An **"Explain with AI"** button appears next to detected code blocks
3. Click it to send the code to your hosted backend API
4. View the explanation in a clean, floating panel right on the page

### Installation (Developer Mode)
```bash
# 1. Open Chrome and go to:
chrome://extensions/

# 2. Enable "Developer mode" (top-right toggle)

# 3. Click "Load unpacked" and select the chrome-extension/ folder

# 4. The extension icon will appear in your toolbar
```

### Extension Structure
```
chrome-extension/
├── manifest.json      # Chrome Manifest V3 configuration
├── background.js      # Service worker for API communication
├── content.js         # Injects "Explain" buttons into web pages
├── content.css        # Styling for injected UI elements
├── popup.html         # Extension popup interface
└── popup.js           # Popup interaction logic
```

## 💻 VS Code Extension

The VS Code extension lets you explain and optimize code without leaving your editor.

### Commands
| Command | Description |
|:--------|:------------|
| `Explain Code with AI` | Select code → Right-click → Get a detailed AI explanation in a side panel |
| `Optimize Code with AI` | Select code → Right-click → Get an optimized version with complexity comparison |

### Installation (Development)
```bash
# 1. Navigate to the extension directory
cd vscode-extension

# 2. Install dependencies
npm install

# 3. Compile TypeScript
npm run compile

# 4. Press F5 in VS Code to launch the Extension Development Host
```

### Extension Structure
```
vscode-extension/
├── package.json       # Extension manifest with commands & menus
├── tsconfig.json      # TypeScript configuration
├── src/
│   └── extension.ts   # Main extension logic (activate, commands)
└── dist/
    └── extension.js   # Compiled output
```

### How It Works
1. **Select** any code in your editor
2. **Right-click** to open the context menu
3. Choose **"Explain Code with AI"** or **"Optimize Code with AI"**
4. A **Webview panel** opens beside your code with the AI-generated explanation
5. Results include structured breakdown, complexity analysis, and optimization tips

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
- **Node.js** v18 or higher
- **npm** or **yarn** package manager
- A **Firebase Project** ([Create one here](https://console.firebase.google.com/))
- A **Groq API Key** ([Get one here](https://console.groq.com/keys))

### Step 1: Clone the Repository
```bash
git clone https://github.com/ask8962/automated-code-explanation-system.git
cd automated-code-explanation-system
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 3: Set Up Environment Variables
Create a `.env.local` file in the root directory by copying the example:
```bash
cp .env.example .env.local
```

Then fill in your credentials:
```env
# Firebase Configuration (from Firebase Console > Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# AI Provider API Key (choose one)
GROQ_API_KEY=your_groq_api_key
# OPENAI_API_KEY=your_openai_api_key
# GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
```

### Step 4: Configure Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/) → Your Project
2. Enable **Authentication** → Sign-in method → **Google**
3. Create a **Firestore Database** in production mode
4. Go to **Firestore Database → Rules** tab and paste the contents of `firestore.rules`

### Step 5: Run the Development Server
```bash
npm run dev
```

### Step 6: Open in Browser
Visit [http://localhost:3000](http://localhost:3000) to see the application running.

## 📡 API Endpoints

The web app exposes three main API routes. These are also used by the Chrome and VS Code extensions.

### `POST /api/explain`
Generates a detailed AI explanation of the provided code.

**Request Body:**
```json
{
  "code": "def bubble_sort(arr):\n  for i in range(len(arr)):\n    for j in range(len(arr)-1):\n      if arr[j] > arr[j+1]:\n        arr[j], arr[j+1] = arr[j+1], arr[j]",
  "language": "python"
}
```

**Response:** Streamed text with structured explanation including purpose, line-by-line breakdown, complexity analysis, and key concepts.

---

### `POST /api/optimize`
Provides an optimized version of the code with complexity comparison.

**Request Body:**
```json
{
  "code": "<your code here>",
  "language": "python"
}
```

**Response:** Streamed text with optimized code, before/after complexity comparison, and explanation of improvements.

---

### `POST /api/flowchart`
Generates a Mermaid.js flowchart diagram from the code logic.

**Request Body:**
```json
{
  "code": "<your code here>",
  "language": "python"
}
```

**Response:** Streamed Mermaid diagram syntax that can be rendered as a visual flowchart.

## 📁 Project Structure

```
automated-code-explanation-system/
│
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Main landing page with code input
│   ├── layout.tsx                # Root layout with providers
│   ├── globals.css               # Global styles and Tailwind utilities
│   ├── providers.tsx             # Theme and context providers
│   ├── error.tsx                 # Error boundary page
│   ├── not-found.tsx             # Custom 404 page
│   ├── api/
│   │   ├── explain/              # AI code explanation endpoint
│   │   ├── optimize/             # AI code optimization endpoint
│   │   └── flowchart/            # AI flowchart generation endpoint
│   ├── auth/                     # Authentication pages
│   ├── dashboard/                # User dashboard with history
│   └── share/                    # Public shared explanation pages
│
├── components/                   # Reusable React components
│   ├── code-input.tsx            # Monaco-based code editor
│   ├── code-explanation-panel.tsx # Explanation display with markdown
│   ├── optimization-panel.tsx    # Side-by-side optimization view
│   ├── flowchart-panel.tsx       # Mermaid flowchart renderer
│   ├── history-panel.tsx         # Explanation history sidebar
│   ├── navbar.tsx                # Navigation bar with auth
│   ├── Scene.tsx                 # 3D hero scene (React Three Fiber)
│   ├── syntax-highlighter.tsx    # Code syntax highlighting
│   ├── theme-provider.tsx        # Dark/light mode provider
│   ├── theme-toggle.tsx          # Theme switcher button
│   ├── explanation-skeleton.tsx  # Loading skeleton UI
│   └── ui/                      # Shadcn UI base components
│
├── lib/                          # Utility libraries
│   ├── firebase.ts               # Firebase client initialization
│   ├── firebase-server.ts        # Firebase admin (server-side)
│   ├── auth-context.tsx          # Authentication context provider
│   └── utils.ts                  # Helper utilities (cn, etc.)
│
├── hooks/                        # Custom React hooks
│
├── chrome-extension/             # Chrome browser extension
│   ├── manifest.json             # Manifest V3 config
│   ├── background.js             # Service worker
│   ├── content.js                # Content script (injects buttons)
│   ├── content.css               # Content script styles
│   ├── popup.html                # Extension popup UI
│   └── popup.js                  # Popup logic
│
├── vscode-extension/             # VS Code editor extension
│   ├── package.json              # Extension manifest
│   ├── src/extension.ts          # Extension source code
│   └── dist/extension.js         # Compiled extension
│
├── public/                       # Static assets
├── styles/                       # Additional stylesheets
├── .env.example                  # Environment variable template
├── firestore.rules               # Firestore security rules
├── next.config.mjs               # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

## 👥 Meet the Team

This project was built by a team of B.Tech CSE students at **GLA University** as part of the 3rd Year Mini Project.

| Name | Class Roll No | University Roll No | Section |
| :--- | :---: | :---: | :---: |
| **Anukalp Gupta** | 12 | 2315000373 | AA |
| **Nishant Singh** | 47 | 2315001492 | AA |
| **Prince Kumar** | 54 | 2315001678 | AA |
| **Utpal Kumar** | 69 | 2315002369 | AA |
| **Jatin Chauhan** | 37 | 2315001014 | AA |

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Tips
- Run `npm run lint` to check for code style issues
- Test API routes locally before pushing
- Follow the existing component patterns in `components/`

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **GLA University** — For providing the platform and guidance for this Mini Project
- **Groq** — For ultra-fast LLM inference with the Llama 3.3 model
- **Vercel** — For seamless deployment and hosting
- **Firebase** — For authentication and database services
- **Shadcn UI** — For the beautiful, accessible component library

---

<p align="center">
  Developed with ❤️ by <strong>Anukalp Gupta, Nishant Singh, Prince Kumar, Utpal Kumar, Jatin Chauhan</strong>
  <br/>
  <strong>GLA University</strong> • B.Tech CSE • 2025
</p>

# Automated Code Explanation System 🚀

> **GLA University Mini Project - B.Tech CSE**
> *Empowering students to understand and optimize code instantly.*

![Project Badge](https://img.shields.io/badge/Status-Complete-green) ![Tech](https://img.shields.io/badge/Built%20With-Next.js%20%7C%20AI-blue)

## 📖 Overview

The **Automated Code Explanation System** is an AI-powered educational tool designed to help students and developers understand complex code snippets. By leveraging advanced Large Language Models (LLMs), specifically **Llama 3 via Groq**, it provides instant, structured explanations, time complexity analysis, and performance optimization suggestions.

This project was developed as a Mini Project for the B.Tech CSE program at **GLA University**.

## ✨ Key Features

- **🤖 AI-Powered Explanations**: Paste any code (Python, Java, C++, C, JS) and get a detailed breakdown.
- **⚡ "Make it Faster" Mode**: One-click optimization to rewrite $O(n^2)$ code into efficient $O(n)$ or $O(n \log n)$ solutions.
- **📊 Complexity Analysis**: Visual cards comparing Time and Space complexity.
- **🎨 Premium UI/UX**: clean, card-based interface with syntax highlighting and glassmorphism design.
- **📜 History Tracking**: Saves all your explanations for future reference (stored securely in Firebase).
- **🔐 Secure Auth**: Google Authentication via Firebase.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Shadcn UI, Lucide Icons
- **Backend (AI)**: Groq API (Llama-3.3-70b-versatile)
- **Database**: Google Firebase (Firestore)
- **Authentication**: Firebase Auth
- **Deployment**: Vercel (Recommended)

## 👥 Meet the Team (GLA University)

| Name | Class Roll No | University Roll No | Section |
| :--- | :--- | :--- | :--- |
| **Anukalp Gupta** | 12 | 2315000373 | AA |
| **Nishant Singh** | 47 | 2315001492 | AA |
| **Prince Kumar** | 54 | 2315001678 | AA |
| **Utpal Kumar** | 69 | 2315002369 | AA |

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
- Node.js (v18+)
- npm or yarn
- A Firebase Project (for Auth & Firestore)
- A Groq API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/ask8962/automated-code-explanation-system.git
    cd automated-code-explanation-system
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables**
    Create a `.env.local` file in the root directory:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    GROQ_API_KEY=your_groq_api_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  **Open locally**
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📸 Screenshots

*(Add screenshots of your Dashboard and Optimization panel here)*

---
Developed with ❤️ by the **GLA University Mini Project Team**

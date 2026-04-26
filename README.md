# 🗳️ Election AI Assistant

An enterprise-grade, accessible intelligence platform designed to empower voters with verified, non-partisan election data. Built with **Next.js 16**, **Fastify**, and **Google Gemini 1.5**, the platform features real-time search grounding, interactive voter guides, and accessibility-first design.

---

## 🚀 Core Features

- **Gemini AI Assistant**: Real-time conversational intelligence grounded with Google Search for 2026 election cycle verification.
- **Voter Alignment Quiz**: Deep-analysis tool to help voters understand candidate positions relative to their values.
- **Interactive Voter Guide**: Step-by-step preparation protocol with elderly-friendly voice guidance and high-contrast UI.
- **Intelligence Dashboard**: Real-time polling analytics, district participation trends, and urgent official bulletins.
- **Accessibility Engine**: Built-in screen reader support, voice guidance, and material symbols replacement for reliable icon rendering.

---

## 🛠️ Technical Architecture

### **Frontend** (`apps/web`)
- **Framework**: Next.js 16 (App Router + Turbopack)
- **Styling**: Tailwind CSS 4 + Glassmorphism Design System
- **State Management**: Zustand
- **Icons**: Lucide React (SVG-based for reliability)
- **Deployment**: Firebase Hosting

### **Backend** (`apps/api`)
- **Server**: Fastify (Node.js)
- **AI Model**: Gemini 1.5 Flash (with Google Search Grounding)
- **Database**: PostgreSQL (Drizzle ORM)
- **Caching**: Redis
- **Vector Search**: Upstash Vector (RAG implementation)

---

## 🏗️ CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment, hardened for reliability:

- **CI Workflow**: Runs on every PR and push to `main`. Executes `npm ci`, linting, and a full production build of the web app with static export verification.
- **CD Workflow**: Automatically deploys the `main` branch to Firebase Hosting. 
  - **Validation**: Verifies the build and linting before deployment.
  - **Artifacts**: Builds the application once and uses the verified artifact for deployment to ensure consistency.
  - **Concurrency**: Managed deployment groups to avoid overlapping production updates.
  - **Security**: Strict validation of Firebase service account secrets.

---

## ⚙️ Configuration

### **Prerequisites**
- Node.js 20+
- Firebase CLI
- Google Cloud API Key (with Generative Language API enabled)

### **Environment Setup**

#### **API Backend** (`apps/api/.env.example`)
```env
GEMINI_API_KEY=your_key_here
REDIS_URL=your_redis_url
UPSTASH_VECTOR_REST_URL=your_vector_url
UPSTASH_VECTOR_REST_TOKEN=your_vector_token
DATABASE_URL=your_postgres_url
```

#### **Web Frontend** (`apps/web/.env.example`)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## 📦 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Mode**:
   ```bash
   npm run dev
   ```

3. **Production Build**:
   ```bash
   npm run build
   ```

4. **Deploy to Firebase**:
   ```bash
   firebase deploy
   ```

---

## 🛡️ Security & Integrity

- **Non-Partisan**: All AI prompts are strictly tuned for neutrality and factual accuracy.
- **Verified Sources**: RAG (Retrieval Augmented Generation) ensures data is pulled from official state and federal databases.
- **Zero-Trust**: No API keys are stored in the client-side code; all sensitive calls are brokered through the Fastify API.

---

## 📄 License
This project is licensed under the Apache 2.0 License. See [LICENSE](LICENSE) for details.

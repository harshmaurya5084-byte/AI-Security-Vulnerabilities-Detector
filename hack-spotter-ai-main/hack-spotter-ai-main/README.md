# Hack Spotter AI

AI-powered security scanner for websites, mobile apps, APIs, and code.

---

## 🚀 What this project does

This app simulates a **full-stack security scanning dashboard** with these core capabilities:

- 🔍 **Website / App / API / Code scanning** with mock vulnerability results
- 🧠 **AI Assistant Chat** for security advice, error troubleshooting, and vulnerability guidance
- 🧾 **Scan History** (persisted locally) with metadata (theme, font, language)
- 🔔 **Real-time scan notifications** (alerts for problems, "All good" when no issues found)
- ⚙️ **Comprehensive Settings** (Profile, Scan settings, Threat monitoring, Notifications, Security preferences, API, Data/Privacy, Admin controls)
- 🧩 Extensible UI built with **React + TypeScript**, **Tailwind**, **shadcn/ui**, **Framer Motion**

---

## 🧪 Running locally

### 1) Install dependencies

```bash
npm install
```

### 2) Start dev server

```bash
npm run dev
```

Then open the URL shown in the terminal (default: `http://localhost:8080`, may auto-bump if already in use).

---

## 📚 Key pages & features

### 🧭 Dashboard
- High-level overview of current scan status, recent findings, and security score.

### 🌐 Website Scanner
- Scan any URL and get simulated vulnerability results.
- Detects the site’s **theme**, **primary font**, and **language**.
- Shows alert toast notifications during scans.

### 📱 App Scanner
- Scan mobile apps and see a similar vulnerability report.
- Includes theme/font/language detection and scan notifications.

### 📜 Scan History
- Stores each scan with metadata and shows it in a timeline.
- Includes scan type, results, and scan date.

### 🧠 AI Assistant (Chat)
- Opens as a floating chat widget.
- Answer questions about security, vulnerabilities, errors, and best practices.
- Works anywhere in the app.

### ⚙️ Settings
Includes eight sections:
- Profile Settings
- Scan Settings
- Threat Monitoring
- Notifications
- Security Preferences
- API Integration
- Data & Privacy
- Admin Controls

---

## 🛠️ Project structure (high-level)

- `src/pages/` – app pages (scanners, history, dashboard, settings)
- `src/components/` – shared UI components, AI assistant, layout, etc.
- `src/contexts/` – global app state (auth + scan history persistence)
- `src/lib/` – utilities

---

## ✅ Tech stack

- **React + TypeScript**
- **Vite**
- **Tailwind CSS + shadcn/ui**
- **Framer Motion**
- **React Router**
- **LocalStorage persistence**

---

## 🧩 Customize

- Update the favicon: `public/favicon.svg`
- Change branding, text, or content in `src/pages/*`
- Add new scan rules or AI tips in `src/components/AIAssistant.tsx`

---

## 🎯 Notes
This project is built as a demo/prototype and uses simulated scanning data (not a real security scanner). It’s designed for learning, prototyping, and UI experimentation.

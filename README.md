# 📚 ExamPro — Mock Exam Platform

A full-stack mock exam web application built with **React 19**, **Vite 8**, and **Supabase**. Features timed exams, instant results with question-by-question review, category management, and a role-based admin panel (OPCO).

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Guide](#setup-guide)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Create a Supabase Project](#3-create-a-supabase-project)
  - [4. Run the Database Schema](#4-run-the-database-schema)
  - [5. Enable Authentication Providers](#5-enable-authentication-providers)
  - [6. Configure Environment Variables](#6-configure-environment-variables)
  - [7. Configure Admin (OPCO) Access](#7-configure-admin-opco-access)
  - [8. Run the App](#8-run-the-app)
- [Authentication Methods](#authentication-methods)
- [Admin Panel (OPCO)](#admin-panel-opco)
- [Database Schema](#database-schema)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Features

- **Landing page** with hero, features showcase, and CTA sections
- **Multiple auth methods** — Email/Password, Email OTP (magic link), and Google OAuth
- **User dashboard** — browse exams by category, view recent results
- **Timed exam-taking** — countdown timer, question flagging, auto-submit on timeout
- **Instant results** — score ring, correct/incorrect/unanswered breakdown, question review
- **OPCO Admin panel** — manage categories, exams, and questions via the browser
- **Responsive design** — works on desktop, tablet, and mobile
- **Row Level Security** — Supabase RLS policies for data protection

---

## Tech Stack

| Layer       | Technology                                        |
| ----------- | ------------------------------------------------- |
| Frontend    | React 19, React Router 7                          |
| Build Tool  | Vite 8                                            |
| Backend/DB  | Supabase (PostgreSQL, Auth, RLS)                  |
| Styling     | Vanilla CSS (glassmorphism, dark theme)            |
| Linting     | ESLint 10 with React Hooks & React Refresh plugins |

---

## Project Structure

```
Exam App/
├── index.html                  # HTML entry point
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite configuration
├── eslint.config.js            # ESLint configuration
├── .env.example                # Environment variable template
├── supabase-schema.sql         # Database schema (run in Supabase SQL Editor)
├── public/
│   ├── favicon.svg             # App favicon
│   └── icons.svg               # SVG icon sprites
└── src/
    ├── main.jsx                # React entry point
    ├── App.jsx                 # Root component with routing
    ├── App.css                 # App-level styles
    ├── index.css               # Global styles & design tokens
    ├── lib/
    │   └── supabase.js         # Supabase client initialization
    ├── config/
    │   └── roles.js            # OPCO admin email configuration
    ├── context/
    │   └── AuthContext.jsx      # Auth context (session, sign-in/up/out, isAdmin)
    ├── components/
    │   ├── Header.jsx / .css   # Navigation header (desktop + mobile)
    │   ├── Footer.jsx / .css   # Landing page footer
    │   ├── ProtectedRoute.jsx  # Auth guard for user routes
    │   └── AdminRoute.jsx      # Auth + admin guard for OPCO routes
    └── pages/
        ├── Landing.jsx / .css  # Public landing page
        ├── Auth.jsx / .css     # Sign In / Sign Up / OTP / Google auth
        ├── Dashboard.jsx / .css # User dashboard (exams & results)
        ├── Exam.jsx / .css     # Exam-taking interface (timer, options, submit)
        ├── Results.jsx / .css  # Results view with score ring & question review
        └── admin/
            ├── AdminDashboard.jsx / .css   # OPCO admin overview with stats
            ├── ManageCategories.jsx / .css  # CRUD for exam categories
            ├── ManageExams.jsx              # CRUD for exams (reuses ManageCategories.css)
            └── ManageQuestions.jsx / .css   # CRUD for questions per exam
```

---

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** — v18 or higher ([download](https://nodejs.org/))
- **npm** — v9 or higher (comes with Node.js)
- **A Supabase account** — free tier works ([supabase.com](https://supabase.com))

Verify your versions:

```bash
node -v   # Should print v18.x.x or higher
npm -v    # Should print 9.x.x or higher
```

---

## Setup Guide

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd "Exam App"
```

### 2. Install Dependencies

```bash
npm install
```

This installs the following key packages:

| Package                | Purpose                        |
| ---------------------- | ------------------------------ |
| `react` / `react-dom`  | UI library (v19)              |
| `react-router-dom`     | Client-side routing (v7)      |
| `@supabase/supabase-js`| Supabase client SDK (v2)      |
| `resend`               | Email sending (if used later) |

### 3. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in:
   - **Project Name**: `ExamPro` (or any name)
   - **Database Password**: choose a strong password (save it)
   - **Region**: pick the closest to your users
4. Click **"Create new project"** and wait for it to finish provisioning

5. Once ready, go to **Project Settings → API** and note down:
   - **Project URL** — looks like `https://abcdefghij.supabase.co`
   - **anon/public key** — starts with `eyJ...`

### 4. Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy the **entire contents** of `supabase-schema.sql` from the project root and paste it into the editor
4. Click **"Run"**

This creates the following four tables with Row Level Security enabled:

| Table           | Purpose                                      |
| --------------- | -------------------------------------------- |
| `categories`    | Exam categories (managed by OPCO admin)      |
| `exams`         | Exams with duration, difficulty, etc.         |
| `questions`     | Multiple-choice questions (A/B/C/D per exam) |
| `exam_results`  | User exam attempts with scores & answers      |

> ⚠️ **Important**: The schema also creates RLS policies. Do **not** skip this step or the app won't be able to read/write data.

### 5. Enable Authentication Providers

In your Supabase dashboard, go to **Authentication → Providers**:

#### A. Email/Password (Required)

1. Click on **Email** provider
2. Make sure **"Enable Email provider"** is turned **ON**
3. **"Confirm email"** — toggle based on your preference:
   - **ON** = users must verify email before signing in (recommended for production)
   - **OFF** = instant sign-in without email verification (easier for development)
4. Click **Save**

#### B. Email OTP / Magic Link (Required for OTP login)

This uses the same Email provider above. Additionally:
1. Stay on the **Email** provider settings
2. Ensure **"Enable Email provider"** is ON — the OTP functionality is built into Supabase's `signInWithOtp` method
3. No extra configuration needed

#### C. Google OAuth (Optional — for "Continue with Google")

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Navigate to **APIs & Services → Credentials**
4. Click **"Create Credentials" → "OAuth 2.0 Client ID"**
5. Set **Application type** = "Web application"
6. Under **Authorized redirect URIs**, add:
   ```
   https://<your-supabase-project-ref>.supabase.co/auth/v1/callback
   ```
   (Find your project ref in Supabase → Settings → General)
7. Copy the **Client ID** and **Client Secret**
8. Back in Supabase → **Authentication → Providers → Google**:
   - Toggle **ON**
   - Paste your **Client ID** and **Client Secret**
   - Click **Save**

> If you skip Google OAuth setup, the "Continue with Google" button will show an error. Everything else will still work.

### 6. Configure Environment Variables

1. Copy the example env file:

   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your Supabase credentials:

   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-key-here
   ```

   > 🔑 Get these from **Supabase Dashboard → Project Settings → API**:
   > - `VITE_SUPABASE_URL` = **Project URL**
   > - `VITE_SUPABASE_ANON_KEY` = **anon / public** key (NOT the `service_role` key)

> ⚠️ **Never commit your `.env` file.** It is already in `.gitignore`.

### 7. Configure Admin (OPCO) Access

Admin access is controlled by a hardcoded email list in `src/config/roles.js`.

1. Open `src/config/roles.js`
2. Replace `'admin@examapp.com'` with **your actual admin email address** (the email you'll use to sign up/in):

   ```js
   export const OPCO_EMAILS = [
     'your-actual-email@example.com',
     // Add more admin emails as needed:
     // 'another-admin@example.com',
   ];
   ```

3. Save the file

> 📝 **How it works**: When a user signs in, the app checks their email against `OPCO_EMAILS`. If it matches, they see the admin panel with full CRUD access to categories, exams, and questions. Regular users only see the student dashboard.

### 8. Run the App

```bash
npm run dev
```

This starts the Vite dev server. Open the URL shown in terminal (default: **http://localhost:5173**).

---

## Authentication Methods

The app supports three sign-in methods (all handled on the `/auth` page):

| Method           | How it works                                                    |
| ---------------- | --------------------------------------------------------------- |
| **Email/Password** | Classic sign-up with email + password (min 6 chars). May require email confirmation depending on Supabase settings. |
| **Email OTP**    | Enter email → receive 6-digit code → enter code to sign in. No password needed. |
| **Google OAuth** | One-click Google sign-in. Requires Google OAuth setup in Supabase (see Step 5C). |

---

## Admin Panel (OPCO)

Admins (users whose email is in `OPCO_EMAILS`) get access to:

| Route                              | Page              | Actions                                              |
| ---------------------------------- | ----------------- | ---------------------------------------------------- |
| `/admin`                           | Admin Dashboard   | View stats (categories, exams, questions, submissions) |
| `/admin/categories`               | Manage Categories | Add, edit, delete, activate/deactivate categories     |
| `/admin/exams`                    | Manage Exams      | Add, edit, delete exams with duration & difficulty     |
| `/admin/exams/:examId/questions`  | Manage Questions  | Add, edit, delete questions (A/B/C/D + correct answer) |

**Workflow to create a full exam:**

1. Sign in with an OPCO admin email
2. Go to `/admin/categories` → create a category (e.g., "Mathematics")
3. Go to `/admin/exams` → create an exam under that category
4. Click **"Questions"** on the exam row → add questions with 4 options each
5. Students can now see and take the exam from their dashboard

---

## Database Schema

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│  categories │     │    exams     │     │  questions   │
├─────────────┤     ├──────────────┤     ├──────────────┤
│ id (PK)     │◄────│ category_id  │     │ exam_id (FK) │
│ name        │     │ id (PK)      │◄────│ id (PK)      │
│ description │     │ title        │     │ question_text│
│ icon        │     │ description  │     │ option_a     │
│ is_active   │     │ duration_min │     │ option_b     │
│ created_at  │     │ total_quest  │     │ option_c     │
└─────────────┘     │ difficulty   │     │ option_d     │
                    │ is_active    │     │ correct_ans  │
                    │ created_at   │     │ sort_order   │
                    └──────────────┘     │ created_at   │
                           ▲             └──────────────┘
                           │
                    ┌──────────────┐
                    │ exam_results │
                    ├──────────────┤
                    │ id (PK)      │
                    │ user_id (FK) │──► auth.users
                    │ exam_id (FK) │
                    │ score        │
                    │ total_quest  │
                    │ answers (JSON)│
                    │ time_taken_s │
                    │ completed_at │
                    └──────────────┘
```

---

## Available Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start Vite dev server (hot reload)   |
| `npm run build`    | Build for production (output: `dist/`) |
| `npm run preview`  | Preview the production build locally |
| `npm run lint`     | Run ESLint on all JS/JSX files       |

---

## Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized static files.

### Deploy Options

The `dist/` folder can be deployed to any static hosting service:

- **Vercel**: `npx vercel --prod`
- **Netlify**: drag & drop `dist/` or use CLI
- **Firebase Hosting**: use `firebase deploy`
- **GitHub Pages**: push `dist/` to `gh-pages` branch

> ⚠️ Since this is a Single Page App with client-side routing, configure your hosting to redirect all routes to `index.html`. For example:
> - **Netlify**: add a `_redirects` file in `public/` with: `/* /index.html 200`
> - **Vercel**: add a `vercel.json` with rewrites

### Environment Variables in Production

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in your hosting provider's dashboard. These are **build-time** variables (Vite inlines them during `npm run build`).

---

## Troubleshooting

| Problem | Solution |
| ------- | -------- |
| **"Supabase credentials missing" in console** | You haven't created a `.env` file or the values are empty. See [Step 6](#6-configure-environment-variables). |
| **Can't sign up / "Invalid API key"** | Double-check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`. Make sure you're using the **anon** key, not `service_role`. |
| **"User already registered"** | The email already has an account. Use Sign In instead of Sign Up. |
| **Email confirmation not arriving** | Check spam folder. In Supabase → Auth → Email Templates, you can customize emails. For dev, disable "Confirm email" in Auth → Providers → Email. |
| **Google sign-in fails** | Google OAuth is not configured. See [Step 5C](#c-google-oauth-optional--for-continue-with-google). |
| **Admin panel not showing** | Your email is not in `OPCO_EMAILS` in `src/config/roles.js`. Add your exact sign-in email (case-insensitive). |
| **No exams on dashboard** | An admin needs to create categories → exams → questions first. See [Admin Panel](#admin-panel-opco). |
| **"relation does not exist" errors** | You haven't run the SQL schema. See [Step 4](#4-run-the-database-schema). |
| **Page shows blank after navigating** | Clear browser cache or hard refresh (`Cmd+Shift+R`). If deploying, ensure SPA redirect rules are configured. |

---

## License

This project is private. All rights reserved.

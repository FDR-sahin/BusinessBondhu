# Business Hub BD — Vercel Backend Deployment Guide

This guide provides step-by-step instructions for setting up, configuring, and deploying the **Business Hub BD** backend database and API to **Vercel**.

---

## 📋 Table of Contents
1. [Architecture Overview](#-architecture-overview)
2. [Database Provisioning (PostgreSQL / MongoDB)](#-database-provisioning)
3. [Option A: Deploying Express API to Vercel (Serverless Functions)](#-option-a-deploying-express-api-to-vercel)
4. [Option B: Next.js Integrated API Route Handlers](#-option-b-nextjs-integrated-api-route-handlers)
5. [Configuring Environment Variables](#-configuring-environment-variables)
6. [CORS & Auth Cookie Configuration](#-cors--auth-cookie-configuration)
7. [Deploying via Vercel CLI / Dashboard](#-deploying-via-vercel-cli--dashboard)
8. [Health Check & Verification](#-health-check--verification)

---

## 🏗️ Architecture Overview

Business Hub BD frontend is built with Next.js 14 and communicates with a REST API backend via Axios.

```
┌────────────────────────────────┐         ┌────────────────────────────────┐
│      Next.js Frontend          │  HTTP   │      Vercel Serverless API      │
│  (Business Hub BD UI App)     ├────────►│    (Express or Route Handlers) │
└────────────────────────────────┘         └───────────────┬────────────────┘
                                                           │
                                                           ▼
                                           ┌────────────────────────────────┐
                                           │    Cloud Database Provider     │
                                           │   (Neon / Supabase / Atlas)    │
                                           └────────────────────────────────┘
```

---

## 🗄️ Database Provisioning

For Vercel serverless deployment, a cloud-hosted serverless database is recommended:

### Recommended Database Services
1. **Neon PostgreSQL** (Recommended for Vercel)
   - Free tier available, serverless auto-scaling.
   - One-click integration in Vercel Marketplace.
2. **Supabase PostgreSQL**
   - Free tier with built-in Auth & Realtime capabilities.
3. **MongoDB Atlas**
   - Free M0 Cluster if using Mongoose / MongoDB schema.

### Database Connection String Format
- **PostgreSQL**: `postgresql://username:password@ep-cool-name.us-east-2.aws.neon.tech/business_hub_bd?sslmode=require`
- **MongoDB**: `mongodb+srv://username:password@cluster0.mongodb.net/business_hub_bd?retryWrites=true&w=majority`

---

## 🚀 Option A: Deploying Express API to Vercel

If your backend is a separate Express / Node.js repository:

### 1. Project Folder Structure
Ensure your backend project root has an `api/index.js` wrapper:

```
my-backend-repo/
├── api/
│   └── index.js      <-- Vercel entry point
├── src/
│   ├── routes/
│   ├── models/
│   └── server.js
├── vercel.json
└── package.json
```

### 2. Create `api/index.js`
```javascript
const app = require("../src/server"); // Export your Express app instance
module.exports = app;
```

### 3. Create `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/index.js"
    }
  ]
}
```

---

## 🛠️ Option B: Next.js Integrated API Route Handlers

If migrating backend API routes directly inside this Next.js repository:

Place handlers inside `src/app/api/v1/[...route]/route.ts`:
- Example: `src/app/api/v1/posts/route.ts`
- Example: `src/app/api/v1/auth/login/route.ts`

Vercel automatically deploys any route handlers in `src/app/api/` as serverless functions.

---

## 🔑 Configuring Environment Variables

In your Vercel Project Dashboard (**Settings -> Environment Variables**), set the following keys:

| Key | Description | Example / Recommended Value |
| --- | --- | --- |
| `DATABASE_URL` | Cloud database connection string | `postgresql://user:pass@ep-xxx.neon.tech/db` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `super-secret-random-32-char-string` |
| `JWT_EXPIRES_IN` | Token expiration time | `7d` |
| `REFRESH_TOKEN_SECRET` | Refresh token secret | `another-super-secret-random-key` |
| `NEXT_PUBLIC_API_URL` | Public API endpoint for frontend | `https://your-backend.vercel.app/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | Frontend domain | `https://business-hub-bd.vercel.app` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary name for image storage | `your_cloud_name` |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary preset | `bhbd_unsigned` |

---

## 🔒 CORS & Auth Cookie Configuration

Ensure cross-origin requests and httpOnly cookies are permitted between frontend and backend Vercel domains:

### Express Middleware Example:
```typescript
import cors from "cors";

const allowedOrigins = [
  "http://localhost:3000",
  "https://business-hub-bd.vercel.app",
  process.env.NEXT_PUBLIC_SITE_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
```

---

## 📦 Deploying via Vercel CLI / Dashboard

### Method 1: Vercel Dashboard (Recommended)
1. Push code to **GitHub / GitLab / Bitbucket**.
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Click **Import Repository** and select your repository.
4. Add the required Environment Variables.
5. Click **Deploy**.

### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy Preview Build
vercel

# Deploy Production Build
vercel --prod
```

---

## ✅ Health Check & Verification

Once deployed:

1. **Verify Health Endpoint**:
   ```bash
   curl -I https://your-backend.vercel.app/api/v1/health
   ```
2. **Update Frontend Environment Variable**:
   In your frontend Vercel deployment, update `NEXT_PUBLIC_API_URL` to point to `https://your-backend.vercel.app/api/v1`.
3. **Test API Requests**:
   - Open browser developer tools -> Network tab.
   - Register a test user or fetch posts on `https://business-hub-bd.vercel.app`.

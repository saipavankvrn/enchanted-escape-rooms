# Deployment Guide

This guide explains how to deploy "The Shadow's House" (Enchanted Escape Rooms) to GitHub and a hosting platform.

## 1. Push Code to GitHub

Since this is a Git repository, you can push your code to GitHub to share it or set up continuous deployment.

### Steps:
1.  **Create a New Repository on GitHub:**
    *   Go to [github.com/new](https://github.com/new).
    *   Name it `enchanted-escape-rooms`.
    *   Initialize with **no** README, .gitignore, or license (we already have them).

2.  **Push Your Code:**
    Open your terminal in the project folder and run:
    ```bash
    git remote set-url origin https://github.com/YOUR_USERNAME/enchanted-escape-rooms.git
    git add .
    git commit -m "Final version for deployment"
    git push -u origin main
    ```

---

## 2. Deploying the Application (Full Stack)

Since this application has both a **Frontend (React)** and a **Backend (Node/Express)**, you cannot simply use GitHub Pages (which only supports static sites).

### Option A: Render.com (Easiest for Monorepos)

Render can build both your frontend and backend from the same repo.

#### 1. Backend Service (Web Service)
*   **Repo:** Connect your GitHub repo.
*   **Build Command:** `npm install`
*   **Start Command:** `npm start` (Runs `node server/index.js`)
*   **Environment Variables:**
    *   `MONGO_URI`: Your MongoDB Connection String.
    *   `JWT_SECRET`: A secret string.
    *   `PORT`: `10000` (Render default).

#### 2. Frontend Service (Static Site)
*   **Repo:** Connect the same repo.
*   **Build Command:** `npm run build`
*   **Publish Directory:** `dist`
*   **Rewrites:** Add a Rewrite Rule -> Source: `/*`, Destination: `/index.html` (for React Router).
*   **Environment Variables:**
    *   `VITE_API_URL`: The URL of your BACKEND service (e.g., `https://my-backend.onrender.com`).

### Option B: Vercel (Frontend) + Railway/Render (Backend)

*   **Frontend:** Deploy the React app to Vercel/Netlify. Set `VITE_API_URL` to your backend URL.
*   **Backend:** Deploy the Node.js server to Railway or Render.

---

## 3. Database (MongoDB Atlas)

Ensure your MongoDB Atlas cluster allows connections from anywhere (`0.0.0.0/0`) in:
`Network Access` -> `Add IP Address` -> `Allow Access from Anywhere`.

## 4. Environment Variables Checklist

Ensure these are set in your deployment platform's dashboard:
*   `MONGO_URI`
*   `JWT_SECRET`
*   `VITE_API_URL` (Frontend only, pointing to backend)

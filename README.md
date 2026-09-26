# Smart Attendance Management System

A production-ready QR-based Attendance Management System built with the MERN stack (MongoDB, Express, React, Node.js). 

## Features
- **Role-based Dashboards:** Admin, Teacher, and Student portals.
- **Dynamic QR Generation:** Teachers generate short-lived QR codes for sessions.
- **Secure Scanning:** Students scan QR codes from their devices. Includes geo-fencing (distance validation from campus) and duplicate attendance prevention.
- **Analytics & Reports:** Detailed subject-wise and class-wise attendance data with CSV exports.
- **Security:** Rate limiting, Helmet, JWT authentication, and robust error handling.

## Architecture & Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Lucide Icons, Recharts.
- **Backend:** Node.js, Express, MongoDB Atlas, Mongoose, JWT.
- **Deployment:** Ready for deployment on Vercel/Netlify (Frontend) and Render/Railway (Backend).

## Local Development Setup

### 1. Backend Setup
1. Navigate to the `backend` directory.
2. Run `npm install`.
3. Create a `.env` file based on `.env.example` and fill in your MongoDB URI and secrets.
4. Start the development server: `npm run dev` (Runs on http://localhost:5000)

### 2. Frontend Setup
1. Navigate to the `frontend` directory.
2. Run `npm install`.
3. Create a `.env` file and add `VITE_API_URL=http://localhost:5000/api`.
4. Start the frontend: `npm run dev` (Runs on http://localhost:5173)

### Demo Accounts
- **Admin:** `admin@sas.edu` / `Admin@123`
- **Teacher:** `rajesh.kumar@sas.edu` / `Teacher@123`
- **Student:** `arjun.singh@student.sas.edu` / `Student@123`

## Production Deployment Guide

### 1. Database (MongoDB Atlas)
1. Ensure your MongoDB Atlas cluster allows connections from your Backend hosting provider's IP range (or allow all `0.0.0.0/0` temporarily if dynamic IPs are used).
2. Copy your connection string to use as `MONGO_URI`.

### 2. Backend Deployment (e.g., Render / Railway)
1. Create a new Web Service using the `backend` folder.
2. Set the build command to `npm install` and start command to `npm start`.
3. Configure Environment Variables:
   - `MONGO_URI`=<Your Atlas URI>
   - `JWT_SECRET`=<Your Strong Secret>
   - `JWT_EXPIRES_IN`=7d
   - `PORT`=5000
   - `FRONTEND_URL`=<Your Production Frontend URL> (e.g. https://your-frontend.vercel.app)
   - `NODE_ENV`=production
   - `GEOFENCING_ENABLED`=true (Set to false if you want to test without GPS validation)
4. Deploy the service and note the backend live URL.

### 3. Frontend Deployment (e.g., Vercel / Netlify)
1. Create a new project pointing to the `frontend` folder.
2. Set Environment Variables before building:
   - `VITE_API_URL`=<Your Live Backend API URL>/api (e.g. https://your-backend.onrender.com/api)
3. Deploy! Note: Vercel uses the `vercel.json` and Netlify uses the `_redirects` file provided to ensure React Router SPA routing works correctly.

## Security Notes
- Never commit `.env` files to source control.
- In production, ensure the frontend is served over HTTPS to allow mobile camera permissions.

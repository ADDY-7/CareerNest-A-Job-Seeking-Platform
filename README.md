# 🪹 CareerNest – Modern Job-Seeking Platform

A full-stack MERN (MongoDB, Express, React, Node.js) job platform built for students and freshers. Features JWT authentication, job listings with search & filters, one-click apply, application tracking dashboard, profile management with resume upload, and an admin panel.

---

## 🚀 Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React 18, React Router v6, Axios, React Hot Toast |
| Backend   | Node.js, Express.js |
| Database  | MongoDB with Mongoose ODM |
| Auth      | JWT (jsonwebtoken) + bcryptjs |
| File Upload | Multer (local → cloud-ready for S3) |
| Styling   | Vanilla CSS (dark theme, gradient design) |

---

## 📁 Project Structure

```
careernest/
├── client/          # React Frontend
│   ├── public/
│   └── src/
│       ├── api/         # Axios instance
│       ├── components/  # Navbar, JobCard, ProtectedRoute
│       ├── context/     # AuthContext (JWT session)
│       └── pages/       # Home, Jobs, Login, Register, Dashboard, Profile, AdminPanel
├── server/          # Node.js Backend
│   ├── config/      # MongoDB connection
│   ├── middleware/  # auth.js, admin.js
│   ├── models/      # User, Job, Application
│   ├── routes/      # auth, jobs, applications, profile, admin
│   ├── uploads/     # Resume files (auto-created)
│   ├── .env
│   ├── seed.js
│   └── server.js
└── README.md
```

---

## ⚙️ Prerequisites

- **Node.js** v16+ and **npm**
- **MongoDB** running locally (`mongod`) on port `27017`  
  *(Or update `MONGO_URI` in `server/.env` to use MongoDB Atlas)*

---

## 📦 Installation

### 1. Clone / navigate to the project

```bash
cd "cloud app job"
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

---

## 🌱 Seed Sample Data

**Before running the app**, seed the database with sample jobs and demo users:

```bash
cd server
node seed.js
```

This creates:

| Role  | Email                     | Password  |
|-------|---------------------------|-----------|
| User  | rahul@example.com         | rahul123  |
| Admin | admin@careernest.com      | admin123  |

And **10 sample job listings** across various roles and types.

---

## ▶️ Running the Application

### Start Backend (Terminal 1)

```bash
cd server
npx nodemon server.js
# Or: npm run dev
```

Server runs at → `http://localhost:5000`

### Start Frontend (Terminal 2)

```bash
cd client
npm start
```

App opens at → `http://localhost:3000`

---

## 🔌 API Reference

| Method | Route                       | Auth   | Description              |
|--------|-----------------------------|--------|--------------------------|
| POST   | /api/auth/register          | Public | Register new user        |
| POST   | /api/auth/login             | Public | Login & get JWT          |
| GET    | /api/jobs                   | Public | Get all jobs (filterable)|
| POST   | /api/jobs                   | Admin  | Create new job           |
| POST   | /api/apply/:jobId           | User   | Apply to a job           |
| GET    | /api/applications           | User   | Get user's applications  |
| GET    | /api/profile                | User   | Get user profile         |
| PUT    | /api/profile                | User   | Update name/skills       |
| POST   | /api/profile/resume         | User   | Upload resume            |
| GET    | /api/admin/applicants       | Admin  | All applicants           |
| PUT    | /api/admin/applicants/:id/status | Admin | Update app status  |

### Query Params for `GET /api/jobs`:
- `?search=<query>` – search by title or company
- `?location=<city>` – filter by location
- `?type=<Full-time|Internship|Remote|Part-time>` – filter by type

---

## 🌍 Environment Variables

Create `server/.env` (already included):

```env
MONGO_URI=mongodb://localhost:27017/careernest
JWT_SECRET=careernest_super_secret_key_2024
PORT=5000
```

---

## ☁️ Cloud Deployment Notes (AWS EC2)

1. **MongoDB**: Replace `MONGO_URI` with MongoDB Atlas cluster URI
2. **Resume Storage**: Replace `multer` local disk storage with `multer-s3` + AWS S3 bucket
3. **CORS**: Update origin in `server.js` to your frontend domain
4. **PM2**: Use `pm2 start server.js` for production backend process management
5. **Nginx**: Use as reverse proxy to serve React build + proxy `/api` to Node

---

## ✨ Features

- 🎨 Modern dark theme with gradient design
- 📱 Fully responsive (mobile-first)
- 🔐 JWT auth with localStorage persistence
- 🔍 Real-time search with debouncing
- 🏷️ Job type filters (Full-time, Internship, Remote, Part-time)
- 📊 Application status tracking (Applied / Shortlisted / Rejected)
- 📄 Resume upload UI (cloud-ready for S3)
- 🛡️ Admin panel: post jobs + manage applicant statuses
- 🔔 Toast notifications for all user actions

---

## 👤 Author

Built as a MERN stack mini project for 3rd year CS undergraduates.

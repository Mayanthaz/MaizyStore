# MAIZY STORE - Modern E-Commerce Platform

A premium digital accounts store built with **React, Node.js, Express, and MySQL**.

![MAIZY STORE Banner](https://via.placeholder.com/1200x400.png?text=MAIZY+STORE+Premium)

## 🚀 Features

- **Modern UI/UX**: Built with React & Vite, featuring glassmorphism, gradients, and smooth animations.
- **Secure Authentication**: JWT-based auth with **Email Verification**.
- **Role-Based Access**: Customer and Admin dashboards.
- **Product Management**: Browse, filter, and search digital products.
- **Shopping Cart**: Real-time cart management with local state.
- **Order System**: Complete order lifecycle pending -> completed.
- **Responsive Design**: Looks great on mobile, tablet, and desktop.

## 🛠️ Tech Stack

### Frontend (Client)
- **React 18**
- **Vite** (Build tool)
- **Tailwind-like CSS** (Custom modern styles)
- **Framer Motion** (Animations)
- **React Router v6** (Navigation)
- **Axios** (API requests)
- **Lucide React** (Icons)
- **React Hot Toast** (Notifications)

### Backend (Server)
- **Node.js & Express**
- **MySQL** (Database)
- **JWT** (Authentication)
- **Bcrypt** (Password hashing)
- **Nodemailer** (Email service)

---

## 🏁 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server

### 1. Database Setup
Import the schema to your MySQL database:
```bash
mysql -u root -p < database/schema.sql
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=maizy_store
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
```

### 3. Install Dependencies

**Backend:**
```bash
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 4. Run the Application

You need to run **both** the backend and frontend terminals.

**Terminal 1 (Backend):**
```bash
npm start
# Runs on http://localhost:3000
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

## 📧 Email Verification Setup

To make email verification work:
1. Use a valid Gmail account.
2. Generate an **App Password** (not your login password).
   - Go to Google Account > Security > 2-Step Verification > App Passwords.
3. Put the email and app password in `.env`.

## 📂 Project Structure

```
maizyweb/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Auth state management
│   │   ├── pages/         # Page views
│   │   └── services/      # API integration
│   └── vite.config.js     # Vite config
├── config/                 # Database config
├── database/               # SQL schema
├── middleware/             # Auth & Validation
├── routes/                 # API Routes
├── services/               # Email service
└── server.js               # Express entry point
```

## 👑 Admin Access

- **Login URL**: http://localhost:5173/login
- **Email**: `admin@maizystore.com`
- **Password**: `admin123`

---

**Built within Maizy Web Project**

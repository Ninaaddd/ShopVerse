# 🛒 Shopverse - Modern Full-Stack E-Commerce Platform (Frontend)

Shopverse is a modern, scalable e-commerce web application built using **React**, **Redux Toolkit**, and **React Router**.
It delivers a complete online shopping experience with **user authentication**, **admin management**, **secure payments**, and **cleanly separated frontend and backend architectures**.

This repository contains the **frontend application only**.
The backend API is maintained in a **separate repository** called **Shopverse Server**.

---

## 🚀 Live Demo

* **Frontend:** [https://myshopverse.vercel.app](https://myshopverse.vercel.app)

---

## 🧠 Architecture Overview

```
Shopverse (Frontend)
│
├── React + Vite
├── Redux Toolkit
│     ├── Auth State
│     ├── Cart State
│     └── Admin State
├── React Router v6
├── Protected Routes (Auth & Admin)
├── PayPal Payment Flow
└── REST API Integration
        │
        └── Shopverse Server (Express + MongoDB)
```

**Why separate repositories?**

* Independent deployments
* Stronger security boundaries
* Easier scalability
* Clear ownership of frontend vs backend responsibilities

---

## ✨ Key Features

### 👤 Authentication & Authorization

* JWT-based authentication using **HTTP-only cookies**
* Automatic session bootstrap on app load
* Role-based access control (User vs Admin)
* Graceful redirects for unauthorized access

---

### 🛍️ Shopping Experience

* Product listing and advanced search
* Persistent shopping cart
* Checkout workflow
* Address management
* Order history tracking

---

### 💳 Payments

* PayPal integration
* Payment success and cancellation handling
* Secure order confirmation after payment

---

### 🧑‍💼 Admin Panel

* Secure admin dashboard
* Product management
* Order management
* Feature controls
* Admin-only route protection

---

### 🧩 UX & Reliability

* Global loading indicators
* Centralized authentication checks
* Clean layout separation:

  * Auth Layout
  * Shopping Layout
  * Admin Layout
* Resilient app bootstrap flow

---

## 🗺️ Application Routes

### Public Routes

```
/shop/home
/shop/listing
/shop/search
```

### Authentication Routes

```
/auth/login
/auth/register
```

### Protected User Routes

```
/shop/checkout
/shop/account
```

### Admin Routes (Admin-only)

```
/admin/dashboard
/admin/products
/admin/orders
/admin/features
```

### Payment Routes

```
/shop/paypal-return
/shop/paypal-cancel
/shop/payment-success
```

---

## 🔐 Route Protection Strategy

Shopverse uses a centralized **CheckAuth** component to enforce security:

* Ensures users are authenticated before accessing protected routes
* Separately validates admin privileges
* Redirects unauthorized users to a dedicated page
* Fully bootstraps authentication state **before rendering routes**

This guarantees consistent behavior across refreshes and deployments.

---

## 🧰 Tech Stack

### Frontend

* **React 18**
* **Redux Toolkit**
* **React Router v6**
* **Vite**
* **Tailwind CSS**
* **PayPal SDK**

### Backend (Separate Repository)

* **Node.js**
* **Express**
* **MongoDB**
* **JWT Authentication**
* **HTTP-only Cookies**
* **Rate Limiting**
* **CORS Protection**

---

## ⚙️ Environment Configuration

Create a `.env` file in the frontend root directory:

```env
VITE_API_BASE_URL=https://myshopverse.vercel.app
```

> Authentication tokens are never stored in `localStorage`.
> All authentication is handled securely via cookies by the backend.

---

## 🛠️ Local Development

### Prerequisites

* Node.js (v18+ recommended)
* Backend server running locally or remotely

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at:

```
http://localhost:5173
```

Ensure the backend server allows `localhost:5173` in its CORS configuration.

---

## 🔗 Backend Repository

👉 **Shopverse Server (Backend)**
[https://github.com/Ninaaddd/Shopverse-Server](https://github.com/Ninaaddd/Shopverse-Server)

The backend is responsible for:

* Authentication & authorization
* Admin validation
* Product, cart, order, and review APIs
* PayPal payment verification
* MongoDB data persistence

---

## 🧪 Security Considerations

* HTTP-only cookies for authentication
* Global rate limiting
* Strict CORS policies in production
* Admin routes protected on both frontend and backend
* `trust proxy` enabled for cloud deployments

---

## 📦 Deployment

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** MongoDB Atlas

Each service is deployed independently for reliability and scalability.

---

## 📌 Planned Enhancements

* Wishlist functionality
* Product recommendations
* Order status tracking
* Admin analytics dashboard
* Email notifications

---

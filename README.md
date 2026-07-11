# 🍽️ HomeBite – Marketplace for Local Home-Cooked Meals

<div align="center">

![HomeBite Banner](./public/banner.png)

### Connecting Local Home Chefs with Food Lovers

A modern full-stack marketplace where customers can discover fresh homemade meals from verified local chefs, place secure orders, chat in real-time, track deliveries, and enjoy an exceptional food ordering experience.

[🌐 Live Demo](https://homebite-15925.web.app/) • [📂 Client Repository](https://github.com/sristikundu1/HomeBite/tree/main/frontend) • [⚙️ Server Repository](https://github.com/sristikundu1/HomeBite/tree/main/backend)

</div>

---

# 📖 Table of Contents

- Overview
- Features
- Tech Stack
- Architecture
- User Roles
- Screenshots
- Folder Structure
- Installation
- Environment Variables
- Available Scripts
- API Overview
- Authentication
- Database
- Deployment
- Future Improvements
- Author

---

# 🚀 Overview

HomeBite is a modern online marketplace that connects talented local home chefs with customers looking for fresh, healthy, and affordable homemade meals.

Customers can:

- Browse delicious meals
- Search and filter foods
- Save favorites
- Add items to cart
- Complete secure Stripe payments
- Track orders in real time
- Chat with chefs
- Leave ratings and reviews

Home chefs can:

- Apply for verification
- Manage their kitchen
- Add and update foods
- Receive and manage orders
- Earn revenue
- Communicate with customers

Administrators can:

- Manage users
- Approve chefs
- Monitor orders
- Manage foods
- Review reports
- Control platform settings

---

# ✨ Features

## 👤 Authentication

- Firebase Authentication
- Email & Password Login
- Google Sign-In
- Protected Routes
- Role-Based Access Control
- Persistent Login
- Remember Me
- Forgot Password

---

## 🍲 Food Marketplace

- Browse Meals
- Food Categories
- Advanced Search
- Filtering
- Sorting
- Food Details
- Related Foods
- Wishlist
- Shopping Cart
- Checkout
- Stripe Payment

---

## 👨‍🍳 Chef Features

- Become a Chef
- Chef Verification Workflow
- Kitchen Profile
- Food Management (CRUD)
- Order Management
- Revenue Dashboard
- Reviews
- Availability Management

---

## 🛒 Customer Features

- Browse Foods
- Add to Wishlist
- Add to Cart
- Secure Checkout
- Order Tracking
- Reviews & Ratings
- Notifications
- Messages
- AI Food Assistant

---

## 🛠️ Admin Features

- Dashboard
- User Management
- Chef Approval
- Food Management
- Order Management
- Analytics
- Reports
- Notifications
- Newsletter Subscribers

---

## 💬 Real-Time Features

- Customer ↔ Chef Chat
- Customer ↔ Admin Chat
- Socket.IO Messaging
- Live Order Tracking
- Notification System

---

## 🤖 AI Assistant

Google Gemini powered assistant capable of:

- Meal Recommendations
- Healthy Food Suggestions
- Budget Suggestions
- Cuisine Recommendations
- Platform Guidance
- Frequently Asked Questions

---

## 🎨 UI / UX

- Responsive Design
- Dark / Light Theme
- Animated Components
- Smooth Page Transitions
- Skeleton Loading
- Custom Cursor
- Scroll To Top Button
- Glassmorphism Elements
- Premium Card Design

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- JavaScript (ES6+)
- React Router DOM
- Tailwind CSS
- DaisyUI
- Framer Motion
- React Query (TanStack Query)
- Axios
- React Hook Form
- Zod / Yup Validation
- React Hot Toast
- Lucide React
- Swiper
- Lottie React
- Socket.IO Client

---

## Backend

- Node.js
- Express.js
- MongoDB Native Driver
- Firebase Admin SDK
- JWT
- Stripe
- Socket.IO
- CORS
- dotenv
- Nodemon

---

## Database

MongoDB

Collections include:

- users
- foods
- carts
- orders
- reviews
- notifications
- chefApplications
- wishlist
- newsletter
- conversations
- messages

---

# 🏗 System Architecture

```
React
     │
     ▼
Express API
     │
     ▼
MongoDB Atlas
     │
Firebase Authentication
     │
Stripe Payment
     │
Socket.IO
     │
Google Gemini AI
```

---

# 👥 User Roles

## Guest

- View Homepage
- Browse Foods
- Browse Chefs
- Read Blogs
- View Pricing
- Contact Page
- Help Center

---

## Customer

- Everything Guest Can Do
- Place Orders
- Wishlist
- Cart
- Checkout
- Reviews
- Notifications
- Chat
- Become a Chef

---

## Home Chef

- Kitchen Dashboard
- Food CRUD
- Order Management
- Revenue
- Availability
- Reviews
- Profile Management

---

## Admin

- Manage Users
- Approve Chefs
- Manage Foods
- Manage Orders
- Analytics
- Reports
- Notifications
- Newsletter

---

# 📂 Project Structure

```
client
│
├── src
│   ├── assets
│   ├── components
│   ├── layouts
│   ├── hooks
│   ├── pages
│   ├── routes
│   ├── providers
│   ├── services
│   ├── contexts
│   ├── utils
│   └── main.jsx
│
└── public

backend
│
├── routes
├── middleware
├── controllers
├── services
├── config
├── utils
├── database
├── socket
└── index.js
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/yourusername/homebite-client.git
```

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

Backend

```bash
npm install

npm run dev
```

---

# 🔐 Environment Variables

Frontend

```env
VITE_API_URL=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_STRIPE_PUBLISHABLE_KEY=

VITE_GEMINI_API_KEY=
```

Backend

```env
PORT=

MONGODB_URI=

JWT_SECRET=

FIREBASE_PROJECT_ID=

FIREBASE_CLIENT_EMAIL=

FIREBASE_PRIVATE_KEY=

STRIPE_SECRET_KEY=
```

---

# 🚀 Available Scripts

```bash
npm run dev

npm run build

npm run preview

npm run lint
```

---

# 🔑 Authentication Flow

```
Register

↓

Firebase Authentication

↓

Create User in MongoDB

↓

JWT Generation

↓

Protected Routes

↓

Role Verification
```

---

# 🛒 Order Flow

```
Browse Meals

↓

Food Details

↓

Wishlist / Cart

↓

Checkout

↓

Stripe Payment

↓

Order Created

↓

Chef Accepts

↓

Preparing

↓

Ready

↓

Out For Delivery

↓

Delivered

↓

Review
```

---

# 💳 Payment

Stripe Payment Gateway

Features

- Secure Checkout
- Payment Intent
- Transaction ID
- Payment History

---

# 🔒 Security

- JWT Authentication
- Firebase Authentication
- Protected API Routes
- Role-Based Authorization
- Environment Variables
- Secure MongoDB Credentials
- Input Validation
- CORS Protection

---

# 📱 Responsive Design

Optimized for

- Desktop
- Laptop
- Tablet
- Mobile

---

# ♿ Accessibility

- Semantic HTML
- Keyboard Navigation
- Focus Indicators
- ARIA Labels
- Color Contrast
- Responsive Typography

---

# 📈 Future Improvements

- Mobile Application
- Push Notifications
- Coupon System
- Loyalty Rewards
- Delivery Partner Dashboard
- Email Verification
- Multi-language Support
- AI Meal Planner
- Recipe Sharing
- Subscription Plans

---

# 👨‍💻 Author

**Sristi Kundu**

Frontend Developer

LinkedIn: www.linkedin.com/in/sristi-kundu-914995262

Portfolio: https://yourportfolio.com

Email: sristikundu1234@email.com

---

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.

---

<div align="center">

Made with ❤️ using React, Express, MongoDB & Firebase

</div>
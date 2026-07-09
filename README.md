# HomeBite - Local Home-Cooked Meals

A lightweight MERN-style starter for a Local Home-Cooked Meals website, focused on a React + Vite frontend with Tailwind CSS + DaisyUI and a Node.js + Express backend using MongoDB without Mongoose.

## Project Setup Plan

1. Frontend
   - Use Vite + React (JavaScript) for a fast, modern UI.
   - Style with Tailwind CSS and DaisyUI for responsive components.
   - Build a hero landing page with a welcome message: **Hello Foody**.
   - Add a simple backend API integration for a connected full-stack experience.

2. Backend
   - Use Node.js with Express and native MongoDB driver.
   - Keep the backend minimal and API-driven.
   - Add a `GET /api/hello` route returning a friendly JSON message.
   - Add a sample `GET /api/meals` endpoint for meal discovery.

3. Database
   - Connect to MongoDB using the official `mongodb` package.
   - Avoid Mongoose and work directly with `MongoClient`.
   - Use environment variables to configure the MongoDB URI.

4. Local development
   - Run frontend on Vite dev server.
   - Run backend on Express server.
   - Proxy frontend `/api` requests to backend for seamless integration.

## Hello Foody Demo

This starter shows a friendly hero screen with the message:

- **Hello Foody**
- **Discover home-cooked meals with warm UX and animation-ready design**

The homepage also fetches a backend greeting from `/api/hello` and displays it in the UI.

## Getting Started

1. Install frontend dependencies:

```bash
cd frontend
npm install
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Start the backend server:

```bash
cd backend
npm run dev
```

4. Start the frontend app:

```bash
cd frontend
npm run dev
```

5. Open the Vite URL shown in the terminal.

## Project Structure

- `frontend/` - Vite React app with Tailwind CSS & DaisyUI
- `backend/` - Express API server and MongoDB connection
- `README.md` - Project plan and setup instructions

## Future Enhancements

- Add authentication and role-based access control
- Add chef and customer dashboards
- Add checkout and orders workflow
- Add meal creation and management
- Add animation transitions with Framer Motion
- Add real MongoDB persistence for meals and users

# VaultX Frontend

This repository contains the React frontend for the VaultX secure file vault project.
It is built with Vite, React 19, Tailwind CSS, and React Router.

## Project Overview

VaultX is a client-side web app designed for secure file vault workflows.
The frontend provides authentication flows and dashboard views for managing items, versions, access, and user details.

### Main pages/routes

- `/` — Home page
- `/login` — Login page
- `/signup` — Signup page
- `/forgot-password` — Password recovery page
- `/dashboard` — Dashboard overview
- `/itemversions/:itemId` — Item version details
- `/accessusers/:itemId` — Access control users page
- `/userdetails/` — User profile details
- `/itemactivity/:itemId` — Item activity history
- `*` — 404 Not Found page

## Key files

- `src/main.jsx` — React entrypoint and router wrapper
- `src/App.jsx` — Route definitions using React Router
- `src/config.js` — Reads backend URL from environment
- `src/assets/pages/` — Page components for each route
- `vite.config.js` — Vite configuration and allowed dev server hosts
- `.env` — Local environment variables (not committed)

## Local setup

```bash
npm install
npm run dev
```

Open the URL shown by Vite (usually `http://localhost:5173`).

## Build

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Environment variables

Create a `.env` file in the project root with the backend base URL:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000/
```

The frontend reads this value from `src/config.js` via `import.meta.env.VITE_API_BASE_URL`.

## Notes

- The app relies on `react-router-dom` for client-side navigation.
- Tailwind CSS is enabled through `@tailwindcss/vite`.
- The current `vite.config.js` includes an `allowedHosts` entry for local development and optional tunnel URLs.
- This repo is a frontend application and expects a backend API to handle authentication and item data.

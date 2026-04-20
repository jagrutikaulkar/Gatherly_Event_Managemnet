
# Gatherly

Gatherly is now split into two codebases inside this workspace:

- [frontend](frontend) for the Vite React app
- [backend](backend) for the Express API and MongoDB logic

## Structure

```text
frontend/
  src/
  index.html
  vite.config.js
  package.json
backend/
  server.js
  services/
  package.json
```

## Run Locally

1. Start the backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Deployment

Deploy the frontend to Vercel and point `VITE_API_URL` at the backend URL. Deploy the backend separately on a Node host such as Render, Railway, or Fly.io.

## Environment Files

- `frontend/.env.example` contains `VITE_API_URL`
- `backend/.env.example` contains `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, and `PORT`

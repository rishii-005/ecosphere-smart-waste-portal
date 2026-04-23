# EcoSphere Smart Waste Portal

EcoSphere Smart Waste Portal is a full-stack web application for smart waste pickup, recycling education, live request tracking, and AI-powered sustainability guidance.

It is designed to feel like a real civic-tech product: citizens can request pickups, admins can manage collection workflows, and the platform offers educational and AI-assisted recycling support in one clean experience.

## Project Highlights

- Waste pickup request system with validation
- Live request status updates with Socket.IO
- AI recycling assistant powered by OpenAI through the backend
- Dashboard with charts and status analytics
- Admin workflow for request management
- Dark mode, animations, responsive UI, and 3D landing visuals
- Live location support with reverse-geocoded address lookup and map preview

## Public Project Description

EcoSphere Smart Waste Portal is a smart city web platform that helps citizens schedule waste pickups, learn how to recycle correctly, and receive AI-powered sustainability guidance. It combines a modern React frontend with an Express and Socket.IO backend to deliver real-time request tracking, role-based access control, and an intuitive government-grade user experience.

## Suggested GitHub Repository Name

```text
ecosphere-smart-waste-portal
```

## Suggested GitHub Description

```text
A full-stack smart waste management platform with pickup requests, live status tracking, recycling education, AI guidance, and admin operations dashboard.
```

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Three.js
- Recharts
- Socket.IO Client
- Lucide React

### Backend

- Node.js
- Express
- TypeScript
- Mongoose
- MongoDB Atlas ready
- Socket.IO
- JWT Authentication
- Zod Validation
- OpenAI SDK
- JSON-based demo storage

## Monorepo Structure

```text
ecosphere-smart-waste-portal/
|-- package.json
|-- README.md
|-- LICENSE
|-- netlify.toml
|-- render.yaml
|-- backend/
|   |-- package.json
|   |-- tsconfig.json
|   |-- .env.example
|   `-- src/
|       |-- server.ts
|       |-- config.ts
|       |-- types.ts
|       |-- data/
|       |-- middleware/
|       |-- routes/
|       |-- socket/
|       `-- utils/
`-- frontend/
    |-- package.json
    |-- vite.config.ts
    |-- vercel.json
    |-- public/
    |   `-- _redirects
    |-- .env.example
    `-- src/
        |-- components/
        |-- context/
        |-- hooks/
        |-- lib/
        |-- pages/
        `-- types/
```

## Local Setup

### 1. Install Node.js

Install Node.js 20 or newer from [nodejs.org](https://nodejs.org/).

### 2. Install dependencies

From the project root:

```bash
npm install
npm run install:all
```

### 3. Configure environment variables

Create `backend/.env` from [backend/.env.example](C:/Users/ASUS/Documents/Codex/2026-04-19-act-as-a-senior-full-stack/backend/.env.example):

```env
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=use-a-long-random-secret
MONGODB_URI=
MONGODB_DB_NAME=ecosphere-smart-waste
OPENAI_API_KEY=sk-your-key
OPENAI_BASE_URL=
OPENAI_MODEL=gpt-4.1-mini
```

For Groq using the OpenAI-compatible API mode, use:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB_NAME=ecosphere-smart-waste
OPENAI_API_KEY=your-groq-key
OPENAI_BASE_URL=https://api.groq.com/openai/v1
OPENAI_MODEL=llama-3.3-70b-versatile
```

Create `frontend/.env` from [frontend/.env.example](C:/Users/ASUS/Documents/Codex/2026-04-19-act-as-a-senior-full-stack/frontend/.env.example) only for deployment or custom backend URLs:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

For local development, the frontend can run without `.env` because Vite proxies `/api` and `/socket.io` to the backend.

## Running Locally

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm run dev
```

### Default Local URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Health endpoint: `http://localhost:5000/health`

## Demo Accounts

```text
Admin
Email: admin@smartwaste.local
Password: password

Citizen
Email: asha@example.com
Password: password
```

## Key Features

### Citizen

- Create waste pickup requests
- Choose waste category
- Add optional image
- Use live location to auto-fill address
- Track status updates
- View analytics dashboard
- Chat with AI recycling assistant

### Admin

- View all pickup requests
- Change status between pending, in progress, and completed
- Trigger live updates to users
- Monitor overall request trends

### AI Assistant

- Recycling suggestions
- Sustainability help
- Waste categorization support
- OpenAI-backed backend route

## Deployment

## Frontend on Vercel

Use the `frontend` folder as the project root.

### Recommended settings

- Framework preset: `Vite`
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`

### Environment variables

```env
VITE_API_URL=https://your-backend-url.onrender.com
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

The repository already includes [frontend/vercel.json](C:/Users/ASUS/Documents/Codex/2026-04-19-act-as-a-senior-full-stack/frontend/vercel.json) for SPA routing.

## Frontend on Netlify

The repository already includes:

- [netlify.toml](C:/Users/ASUS/Documents/Codex/2026-04-19-act-as-a-senior-full-stack/netlify.toml)
- [frontend/public/_redirects](C:/Users/ASUS/Documents/Codex/2026-04-19-act-as-a-senior-full-stack/frontend/public/_redirects)

### Recommended settings

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `dist`

### Environment variables

```env
VITE_API_URL=https://your-backend-url.onrender.com
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

## Backend on Render

The repository includes [render.yaml](C:/Users/ASUS/Documents/Codex/2026-04-19-act-as-a-senior-full-stack/render.yaml) for Render Blueprint deployment.

### Manual environment variables

```env
PORT=5000
CLIENT_URL=https://your-frontend-url.vercel.app
JWT_SECRET=your-production-secret
MONGODB_URI=your-mongodb-atlas-connection-string
MONGODB_DB_NAME=ecosphere-smart-waste
OPENAI_API_KEY=your-openai-or-groq-key
OPENAI_BASE_URL=https://api.groq.com/openai/v1
OPENAI_MODEL=llama-3.3-70b-versatile
```

### Build and start commands

```bash
npm install && npm run build
npm run start
```

## Backend on Railway

Set the service root to `backend` and use:

```bash
npm install && npm run build
npm run start
```

Add the same environment variables used for Render.

## Production Notes

- The backend now supports MongoDB Atlas through Mongoose
- If `MONGODB_URI` is set, MongoDB is used automatically
- If `MONGODB_URI` is not set, the app falls back to `backend/src/data/db.json`
- OpenAI-compatible API keys must remain server-side only

## Build Verification

The project builds successfully:

```bash
npm run build --prefix backend
npm run build --prefix frontend
```

## GitHub Upload Steps

If Git is installed on your machine, run these commands from the project root:

```bash
git init
git add .
git commit -m "Initial commit: EcoSphere Smart Waste Portal"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ecosphere-smart-waste-portal.git
git push -u origin main
```

## Suggested GitHub Topics

```text
react
typescript
vite
express
socket-io
tailwindcss
openai
smart-city
recycling
sustainability
dashboard
full-stack
```

## Suggested Screenshot Sections for GitHub

- Landing page
- Dashboard
- Pickup request page
- AI assistant page
- Admin panel
- Live location preview

## Future Improvements

- Database integration with MongoDB Atlas
- Cloud file uploads
- Role-based admin audit logs
- Better map interaction with draggable pins
- Push notifications
- Advanced route optimization
- Full end-to-end test coverage

## License

This project is released under the MIT License. See [LICENSE](C:/Users/ASUS/Documents/Codex/2026-04-19-act-as-a-senior-full-stack/LICENSE).

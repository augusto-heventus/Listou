# Listou Plus

## Overview
A React + TypeScript application with Vite and Tailwind CSS, using Supabase as the backend service.

## Project Structure
- `/src` - React application source code
- `/src/lib` - Library utilities (Supabase client)
- `/src/services` - Service layer for API calls
- `/src/stores` - Zustand state management stores
- `/src/hooks` - Custom React hooks
- `/supabase` - Supabase configuration and migrations

## Tech Stack
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 4
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL + Auth)
- **Charts**: Recharts
- **Routing**: React Router DOM

## Environment Variables Required
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous/public key

## Development
- Dev server runs on port 5000
- Use `npm run dev` to start development server
- Use `npm run build` to create production build
- Use `npm test` for running tests

## Deployment
- Static deployment using built assets from `dist` directory
- Build command: `npm run build`

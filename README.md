# TaskFlow Frontend

> A modern task management dashboard built with Next.js 15, React 19, and TypeScript.

[Live Demo](https://your-live-link.vercel.app) · [Backend Repo](../backend)

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19, Tailwind CSS 4, Radix UI primitives
- **State:** Redux Toolkit (auth), TanStack Query (server data)
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts
- **HTTP:** Axios with interceptors

## Features

- Role-based dashboards (Admin, Project Manager, Team Member)
- Project management with status tracking
- Task board with list/kanban views
- Real-time notifications
- Team management (admin: create, edit, delete users)
- Activity feed
- Analytics dashboard with charts
- Dark/light theme toggle
- Responsive design
- Pagination on all list views

## Project Setup

```bash
# Install dependencies
pnpm install

# Copy env file
cp .env.local.example .env.local

# Start dev server
pnpm dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | `http://localhost:5000/api` | Backend API base URL |

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm type-check` | TypeScript type checking |

## Deployment (Vercel)

1. Push to GitHub
2. Import repo on [vercel.com/new](https://vercel.com/new)
3. Set environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
   ```
4. Deploy

Vercel auto-detects Next.js and configures the build.

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # Login/signup (public)
│   │   └── (dashboard)/        # Protected dashboard routes
│   │       ├── projects/
│   │       ├── tasks/
│   │       ├── team/
│   │       ├── analytics/
│   │       └── settings/
│   ├── components/
│   │   ├── ui/                 # Radix-based UI primitives
│   │   ├── shared/             # Reusable components
│   │   ├── layout/             # Sidebar, Navbar
│   │   ├── projects/
│   │   ├── tasks/
│   │   ├── team/
│   │   └── notifications/
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # API clients, query config
│   ├── store/                  # Redux store
│   ├── types/                  # TypeScript types
│   └── utils/                  # Helpers, formatters
```

License
MIT License

---

More Projects and Information
👉 Explore additional projects and find out more about my work on my portfolio website: [Md Mobassher Hossain](https://mobassher.com)
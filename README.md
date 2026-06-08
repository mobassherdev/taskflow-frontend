# TaskFlow Frontend

> A modern task management dashboard built with Next.js, React 19, and TypeScript.

[Live Demo](https://taskflow-mobassher.vercel.app) · [Backend Repo](https://github.com/mobassherdev/taskflow-backend)

## Tech Stack

- **Framework:** Next.js (App Router)
- **UI:** React 19, Tailwind CSS 4, Radix UI primitives, Lucide icons
- **State:** Redux Toolkit (auth, filters, UI), TanStack Query (server data)
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts
- **HTTP:** Axios with interceptors
- **Theme:** next-themes (dark/light toggle)
- **Toasts:** Sonner

## Features

- Role-based dashboards (Admin, Project Manager, Team Member)
- Project management with status tracking and member management
- Task board with list/kanban views, filters, and pagination
- Real-time notifications (panel with unread count, mark read)
- Team management with add/edit/delete users (admin only, 3-dot dropdown)
- Activity feed
- Analytics dashboard with charts (KPIs, task status, priority, workload, project progress)
- Dark/light theme toggle
- Responsive design with mobile navigation
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
   NEXT_PUBLIC_API_URL=https://taskflow-server-mobassher.vercel.app/api
   ```
4. Deploy

Vercel auto-detects Next.js and configures the build.

## Project Structure

```
frontend/
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── globals.css
│   │   ├── layout.tsx              # Root layout
│   │   ├── not-found.tsx           # 404 page
│   │   ├── (auth)/                 # Public routes
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   └── (dashboard)/            # Protected dashboard routes
│   │       ├── layout.tsx          # Dashboard layout (sidebar, topbar)
│   │       ├── page.tsx            # Dashboard home
│   │       ├── analytics/page.tsx
│   │       ├── projects/
│   │       │   ├── page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── settings/page.tsx
│   │       ├── tasks/page.tsx
│   │       └── team/page.tsx
│   ├── components/
│   │   ├── charts/                 # Recharts wrappers
│   │   │   ├── TeamProductivityChart.tsx
│   │   │   ├── ProjectProgressBar.tsx
│   │   │   ├── TaskStatusDonutChart.tsx
│   │   │   └── TasksByPriorityChart.tsx
│   │   ├── dashboard/              # Dashboard cards & widgets
│   │   │   ├── KpiCard.tsx
│   │   │   ├── RecentActivity.tsx
│   │   │   ├── TeamWorkloadTable.tsx
│   │   │   ├── UpcomingDeadlines.tsx
│   │   │   └── ProjectProgressCard.tsx
│   │   ├── layout/                 # Sidebar, Topbar, MobileNav, ThemeToggle
│   │   ├── notifications/          # NotificationPanel
│   │   ├── projects/               # ProjectCard, ProjectForm, ProjectFilters, etc.
│   │   ├── shared/                 # Pagination, DeleteConfirmModal, SearchInput, etc.
│   │   ├── tasks/                  # TaskDetailSheet, TaskForm, TaskTable, TaskKanban, etc.
│   │   ├── team/                   # MemberCard, UserForm, EditUserForm, AddMemberDialog
│   │   └── ui/                     # Radix-based primitives (button, dialog, sheet, etc.)
│   ├── hooks/                      # Custom React hooks
│   │   ├── useAnalytics.ts
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useNotifications.ts
│   │   ├── useProjects.ts
│   │   └── useTasks.ts
│   ├── lib/                        # API clients, query config
│   │   ├── utils.ts
│   │   ├── api/                    # Axios client + endpoint modules
│   │   │   ├── client.ts
│   │   │   ├── auth.api.ts
│   │   │   ├── projects.api.ts
│   │   │   ├── tasks.api.ts
│   │   │   ├── users.api.ts
│   │   │   ├── notifications.api.ts
│   │   │   ├── activity.api.ts
│   │   │   └── analytics.api.ts
│   │   └── query/                  # React Query setup
│   │       ├── keys.ts
│   │       ├── providers.tsx
│   │       └── queryClient.ts
│   ├── middleware.ts               # Route protection
│   ├── store/                      # Redux store
│   │   ├── index.ts
│   │   ├── hooks.ts
│   │   ├── types.ts
│   │   └── slices/
│   │       ├── authSlice.ts
│   │       ├── filterSlice.ts
│   │       └── uiSlice.ts
│   ├── types/                      # TypeScript types
│   │   ├── api.types.ts
│   │   ├── auth.types.ts
│   │   ├── project.types.ts
│   │   └── task.types.ts
│   └── utils/                      # Helpers, formatters
│       ├── cn.ts
│       ├── constants.ts
│       └── formatters.ts
```

## License

MIT License

---

More Projects and Information
Explore additional projects and find out more about my work on my portfolio website: [Md Mobassher Hossain](https://mobassher.com)

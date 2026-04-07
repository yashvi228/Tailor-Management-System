# Fabric & Fit

[![React](https://img.shields.io/badge/React-18.3-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-green?logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-cyan?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.45-purple?logo=supabase)](https://supabase.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn--ui-0.9-emerald?logo=shadcn)](https://ui.shadcn.com/)

Fabric & Fit is a modern web application designed for tailors and custom garment shops. It provides an intuitive dashboard to manage customers, track body measurements, create and monitor custom orders through production stages, and view key business metrics.

## ✨ Features

- **Dashboard**: Overview of total customers, orders, pending/in-progress, and recent orders with status badges.
- **Customers**: Add/edit customer details (name, phone, email, address, notes) with detailed measurement tracking (chest, waist, hips, shoulder, etc.).
- **Orders**: Full CRUD for orders including garment type (shirt, pants, suit, etc.), status workflow (pending → cutting → stitching → finishing → ready → delivered), pricing, advance payments, delivery dates.
- **Authentication**: Supabase-based user auth with protected routes.
- **Responsive UI**: Built with shadcn/ui components, Tailwind CSS, dark mode support.
- **Real-time Data**: TanStack Query for optimistic updates and caching.
- **Charts & Stats**: Recharts integration for visualizations (extendable).

![Screenshot Placeholder](public/placeholder.svg)

## 🛠 Tech Stack

| Category | Technologies |
|----------|--------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router, TanStack Query, React Hook Form, Zod |
| Backend | Supabase (PostgreSQL, Auth, Realtime) |
| UI Components | Radix UI primitives, Lucide icons, Sonner toasts, Headless UI patterns |
| Testing | Vitest, Playwright, Testing Library |
| Utils | class-variance-authority (CVA), clsx, date-fns |

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- [Supabase](https://supabase.com/) account and project (free tier works)

### Setup
1. Clone the repo:
   ```bash
   git clone <repo-url>
   cd fabric-and-fit-main
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Create `.env.local` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Local Supabase (Optional for development)**:
   ```bash
   npx supabase init
   npx supabase start
   # Run migration:
   npx supabase db reset
   ```
   Update `.env.local` with local Supabase URL/key.

5. Run development server:
   ```bash
   bun dev
   ```
   Open [http://localhost:5173](http://localhost:5173)

### 🌐 Running on Local Network
To access the app from other devices on your local network (e.g., phone/tablet):

```bash
bun dev --host 0.0.0.0
```

- App will be available at `http://0.0.0.0:5173` or your machine's local IP (e.g., `http://192.168.1.100:5173`).
- Find your IP:
  - macOS: `ifconfig | grep inet`
  - Windows: `ipconfig`
- Ensure firewall allows port 5173. No port forwarding needed for local network.

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `bun dev` | Start dev server (localhost) |
| `bun dev --host 0.0.0.0` | Start dev server on local network |
| `bun build` | Build for production |
| `bun build:dev` | Dev build |
| `bun preview` | Preview production build |
| `bun lint` | Lint code |
| `bun test` | Run tests |
| `bun test:watch` | Watch mode tests |

## 📁 Project Structure

```
src/
├── pages/          # Main views: Dashboard, Customers, Orders, Measurements, Auth
├── components/     # shadcn/ui + custom: AppLayout, StatusBadge, NavLink
├── hooks/          # useAuth, useToast, useMobile
├── integrations/   # Supabase client & types
└── lib/            # utils.ts
```

## 🗄 Database Schema (Supabase PostgreSQL)

- **customers**: id, name, phone, email, address, notes
- **measurements**: customer_id (FK), chest/waist/hips/shoulder/sleeve/inseam/etc., notes
- **orders**: customer_id (FK), garment_type (enum), status (enum: pending/cutting/stitching/finishing/ready/delivered), price, advance_paid, dates

RLS enabled; full access for authenticated users (single-shop setup).

## 🧪 Testing

```bash
bun test
```

Includes unit tests (Vitest) and E2E (Playwright).

## 🚀 Deployment

- **Frontend**: `bun build` → deploy `dist/` to Netlify/Vercel.
- **Backend**: Use hosted Supabase or self-host with Docker.
- Set env vars in hosting platform.

## 🤝 Contributing

1. Fork & clone
2. `bun install`
3. Create feature branch
4. `bun test`
5. PR to `main`

## 📄 License

MIT

---

⭐ **Star on GitHub** | 💬 **Issues** | 🐛 **Bugs**


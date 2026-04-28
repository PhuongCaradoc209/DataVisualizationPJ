# Data Analyst Dashboard (React + TS + Tailwind)

Production-oriented dashboard scaffold built from refactored Stitch exports.

## Stack

- React + TypeScript
- React Router (nested routes + `Outlet`)
- TailwindCSS (via `@tailwindcss/vite`)

## Commands

- `yarn dev` — start dev server
- `yarn build` — production build
- `yarn typecheck` — strict TypeScript checks

## Structure

- `src/components/layout` — `Header`, `Sidebar`, `MainLayout`
- `src/pages/*` — dashboard pages (Dashboard/Reports/Analysis/Settings)
- `src/routes/index.tsx` — centralized routing

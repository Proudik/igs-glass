# IGS Glass — Bespoke Architectural Glass & Rooflights

Production website for IGS Glass Ltd, a UK family business specialising in bespoke structural glass, facades, and premium fixed rooflights.

## Tech Stack

- **Framework**: Next.js 13.5 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Deployment**: Netlify

## Project Structure

```
app/              — Next.js App Router pages
components/       — React components (UI, layout, cart, GDPR)
hooks/            — Custom React hooks
lib/              — Business logic, contexts, services, types
public/           — Static assets (favicons, images, docs)
supabase/         — Database migrations & edge functions
```

## Key Features

- Bespoke product catalogue with Supabase-backed data
- Rooflights shop with cart and checkout flow
- Quote request system with email notifications (Brevo)
- User accounts with Supabase Auth
- Admin dashboard for product/order management
- GDPR cookie consent banner
- SEO optimised (sitemap, robots, OpenGraph, llms.txt)
- Responsive design with IGS brand identity

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

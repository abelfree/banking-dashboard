# Meridian Bank Dashboard

A responsive fintech account dashboard: balance cards across checking, savings, and credit accounts, a spending breakdown chart, a searchable/filterable transaction list, and a transfer form with real client-side validation.

**Live demo:** https://abel-banking-dashboard.netlify.app

![Dashboard screenshot](./screenshot.png)

## What it does

- **Balance cards** for three account types (checking, savings, credit), pulled from a mock REST API.
- **Spending by category** chart (Recharts) computed client-side from transaction history.
- **Transaction list** with live search-by-merchant and category filtering.
- **Transfer form** (React Hook Form + Zod) that validates account selection, amount, and note length, then posts a new transaction and updates both account balances.
- Loading, empty, and error states for every data-driven section — nothing renders blank while data is in flight.

## Stack

- React 19 + Vite
- Tailwind CSS 4
- React Hook Form + Zod for form state and schema validation
- Recharts for the spending chart
- Axios for API calls
- [Mock Service Worker](https://mswjs.io/) intercepting requests at the network layer with a real REST API shape (`GET /accounts`, `GET /transactions`, `POST /transactions`, `PATCH /accounts/:id`) — no backend process required, so the deployed static build works exactly like local dev

## Running locally

```bash
npm install
npm run dev
```

## What I learned

Building the transfer flow was the most interesting part: it needed to update two resources (the new transaction and both account balances) after a single form submission, while keeping the UI in a clean loading/error state throughout. Structuring data-fetching as small hooks (`useAccounts`, `useTransactions`) with their own `refetch` made it straightforward to re-sync the dashboard after a mutation without over-engineering a global store for a project this size.

I originally wired this up against `json-server` as a separate local process. That's fine for development, but it meant the "live demo" would just be a UI shell with every request failing once deployed — there's no server to deploy alongside a static site. Switching to MSW moved the mock API into the browser itself via a service worker, so the same request/response contract works identically in dev and in the deployed build.

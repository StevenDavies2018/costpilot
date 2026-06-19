# ExpenseForge Setup Guide

## Project Overview

ExpenseForge is a niche-specific receipt scanner and expense tracker for the Canadian market. It consists of:

- **iOS App** (D:\ExpenseForge\apps\ios) — React Native + Expo
- **Web Backend** (D:\ExpenseForge\apps\web) — Next.js on Vercel
- **Shared Database** — Neon PostgreSQL
- **Shared Types** — TypeScript interfaces in packages/shared

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  ExpenseForge (Monorepo)                               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐          ┌──────────────┐        │
│  │  iOS App     │          │  Web App     │        │
│  │ (Expo)       │          │ (Next.js)    │        │
│  │ apps/ios/    │          │ apps/web/    │        │
│  └──────┬───────┘          └──────┬───────┘        │
│         │                         │                │
│         └─────────┬───────────────┘                │
│                   │                                │
│              API Calls                             │
│                   │                                │
│         ┌─────────▼────────────┐                  │
│         │  Vercel (Next.js API)│                  │
│         └─────────┬────────────┘                  │
│                   │                                │
│         ┌─────────▼────────────┐                  │
│         │  Neon PostgreSQL     │                  │
│         │  (Database)          │                  │
│         └──────────────────────┘                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Features by Niche

### Contractors
- Equipment & tool expense tracking
- Vehicle deduction calculations
- Software/subscription tracking
- GST/HST compliance

### Real Estate Agents
- Mileage tracking (critical for showings)
- Vehicle expense deductions
- Marketing & advertising costs
- Professional development tracking
- Property-related expenses

### Other
- Flexible category structure
- Basic expense tracking
- Mileage support

## Getting Started

### 1. Prerequisites
```bash
# Install Node.js 18+
# Install pnpm (recommended over npm)
npm install -g pnpm
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Fill in your credentials:
# - Database URL (Neon)
# - OAuth credentials (Google, Facebook, LinkedIn)
# - JWT secret
```

### 3. Database Setup

**Create Neon database:**
1. Go to https://neon.tech
2. Create a new project
3. Copy the connection string to `DATABASE_URL`

**Run migrations:**
```bash
# The SQL schema is in packages/db/schema.sql
# Execute it against your Neon database using:
# - psql CLI
# - Neon dashboard SQL editor
# - Any PostgreSQL client
```

### 4. OAuth Configuration

**Google OAuth:**
1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add redirect URI: `https://yourapp.com/api/auth/callback/google`
6. Copy credentials to `.env.local`

**Facebook & LinkedIn:**
- Similar process for each platform
- Set redirect URIs for your app domain

### 5. Install Dependencies
```bash
pnpm install
```

### 6. Run Development Servers

**Web backend (in separate terminal):**
```bash
pnpm dev:web
# Runs on http://localhost:3000
```

**iOS app (in separate terminal):**
```bash
pnpm dev:ios
# Launches Expo dev server
```

## API Endpoints

### Authentication
- `POST /api/auth/callback/google` — Google OAuth callback
- `POST /api/auth/callback/facebook` — Facebook OAuth callback
- `POST /api/auth/callback/linkedin` — LinkedIn OAuth callback
- `POST /api/auth/onboard` — User onboarding & niche selection

### Receipts
- `POST /api/receipts/upload` — Upload receipt image & run OCR
- `GET /api/receipts?user_id=...` — List user's receipts

### Expenses
- `POST /api/expenses` — Create expense entry
- `GET /api/expenses?user_id=...&month=YYYY-MM` — List expenses

### Mileage (Contractors & RE Agents)
- `POST /api/mileage` — Log mileage entry
- `GET /api/mileage?user_id=...&year=YYYY` — Get mileage for year

### Tax Export
- `GET /api/tax-summary?user_id=...&year=YYYY` — Get tax summary
- `POST /api/tax-summary` — Export as CSV/PDF

## Database Schema

Key tables:
- `users` — User accounts, OAuth info, niche selection
- `receipts` — Receipt images & OCR data
- `expenses` — Expense entries with categories
- `mileage` — Mileage logs (auto-calculates CRA deductions)
- `tax_summary` — Generated yearly summaries

See `packages/db/schema.sql` for full schema.

## Shared Types

All TypeScript types are in `packages/shared/types/index.ts`:
- `User`, `Receipt`, `Expense`, `Mileage`, `TaxSummary`
- `UserNiche` enum
- Category lists by niche
- API response types

## Deployment

### Web (Vercel)
```bash
# Connected to GitHub, auto-deploys on push
# Set environment variables in Vercel dashboard
git push origin main
```

### iOS (EAS Build)
```bash
# Use Expo Application Services
cd apps/ios
eas build --platform ios
```

## Development Workflow

1. **Make changes** to code
2. **Commit to feature branch**
3. **Create PR** against main
4. **Code review** (check types, tests)
5. **Merge to main** → auto-deploys web app
6. **Build iOS** via EAS for TestFlight/App Store

## Next Steps

- [ ] Configure OAuth providers
- [ ] Set up Neon database
- [ ] Implement actual API endpoints (currently stubs with TODO comments)
- [ ] Build onboarding UI
- [ ] Implement OCR (Tesseract.js or cloud API)
- [ ] Build receipt/expense UI (iOS & web)
- [ ] Add mileage tracking features
- [ ] Implement tax export
- [ ] Set up Vercel deployment
- [ ] Configure iOS app signing & EAS build

## Support

For issues:
1. Check the API endpoint stub files (see TODO comments)
2. Verify environment variables are set
3. Check database connection
4. Review shared types in packages/shared/types

---

**Repository:** https://github.com/StevenDavies2018/ExpenseForge.git


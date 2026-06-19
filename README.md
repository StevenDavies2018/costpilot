# CostPilot

Niche-specific receipt scanner and expense tracker for the Canadian market.

## Project Structure

```
costpilot/
├── apps/
│   ├── ios/          # React Native (Expo) iOS app
│   └── web/          # Next.js backend & web interface
├── packages/
│   ├── shared/       # Shared types, constants, utilities
│   └── db/           # Database migrations & schema (Neon)
└── package.json      # Monorepo root
```

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm

### Install Dependencies
```bash
pnpm install
```

### Development

**iOS app:**
```bash
pnpm dev:ios
```

**Web app:**
```bash
pnpm dev:web
```

### Building

**iOS:**
```bash
pnpm build:ios
```

**Web:**
```bash
pnpm build:web
```

## Architecture

- **iOS App:** Expo/React Native (D:\CostPilot\apps\ios)
- **Backend:** Next.js on Vercel (D:\CostPilot\apps\web)
- **Database:** Neon PostgreSQL (shared)
- **Authentication:** OAuth (Google, Facebook, LinkedIn)

Both apps share the same database and authentication system.

## Target Markets

- Contractors
- Real Estate Agents
- Other professionals

Each user gets a custom experience tailored to their profession.

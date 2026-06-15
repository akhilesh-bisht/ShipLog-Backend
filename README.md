# ShipLog Backend

Production-grade Node.js + Express + TypeScript API for ShipLog.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20 |
| Language | TypeScript |
| Framework | Express.js |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Auth | GitHub OAuth + JWT |
| Validation | Zod |
| GitHub API | Octokit |

## Project Structure

```
src/
├── config/
│   ├── env.ts          # Environment variable validation
│   └── prisma.ts       # Prisma client singleton
├── controllers/
│   ├── auth.controller.ts      # DAY 4 — GitHub OAuth
│   ├── repo.controller.ts      # DAY 6+7 — Repos + PR fetching
│   ├── release.controller.ts   # WEEK 2 — Release management
│   └── changelog.controller.ts # WEEK 2 — Public changelog
├── middleware/
│   ├── auth.middleware.ts      # DAY 5 — JWT verification
│   ├── error.middleware.ts     # Global error handler
│   └── validate.middleware.ts  # Zod request validation
├── prisma/
│   └── schema.prisma   # DAY 2 — All 5 DB tables
├── routes/
│   ├── auth.routes.ts
│   ├── repo.routes.ts
│   ├── release.routes.ts
│   └── changelog.routes.ts
├── services/
│   └── github.service.ts   # DAY 7 — GitHub API calls
├── types/
│   ├── express.d.ts    # Extend req.user type
│   └── index.ts        # Shared types
├── utils/
│   ├── AppError.ts     # Custom error class
│   └── asyncHandler.ts # Async route wrapper
├── app.ts              # Express app setup
└── server.ts           # Entry point
```

## Day-by-Day What Was Built

| Day | What |
|-----|------|
| Day 1 | Project setup, package.json, tsconfig |
| Day 2 | Prisma schema — 5 tables |
| Day 3 | Express app, middleware, health check |
| Day 4 | GitHub OAuth, JWT generation |
| Day 5 | Auth middleware, protect routes |
| Day 6 | Repo connect/list/delete |
| Day 7 | GitHub API — fetch merged PRs |

## Setup Instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
# Fill in all values in .env
```

### 3. Set up Supabase database
- Go to https://supabase.com → New Project
- Copy the connection URI from: Project Settings → Database → URI
- Paste it in .env as DATABASE_URL

### 4. Set up GitHub OAuth App
- Go to: https://github.com/settings/developers
- OAuth Apps → New OAuth App
- Homepage URL: http://localhost:3000
- Callback URL: http://localhost:5000/api/auth/github/callback
- Copy Client ID and Secret into .env

### 5. Run database migrations
```bash
npm run db:generate   # generate Prisma client
npm run db:migrate    # create tables in Supabase
```

### 6. Start development server
```bash
npm run dev
```

Server starts at: http://localhost:5000

### 7. Test the health check
```
GET http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "ShipLog API",
  "environment": "development",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## API Routes

### Auth
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /api/auth/github | No | Redirect to GitHub login |
| GET | /api/auth/github/callback | No | OAuth callback |
| GET | /api/auth/me | Yes | Get current user |
| POST | /api/auth/logout | Yes | Logout |

### Repos
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /api/repos | Yes | List connected repos |
| POST | /api/repos | Yes | Connect a repo |
| DELETE | /api/repos/:id | Yes | Disconnect repo |
| GET | /api/repos/:id/prs | Yes | Fetch merged PRs |

### Releases
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /api/releases | Yes | List releases |
| POST | /api/releases | Yes | Create release |
| GET | /api/releases/:id | Yes | Get release |
| PUT | /api/releases/:id | Yes | Update release |
| POST | /api/releases/:id/publish | Yes | Publish release |
| DELETE | /api/releases/:id | Yes | Delete release |

### Public Changelog
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /api/changelog/:slug | No | Get published changelog |
| POST | /api/changelog/:slug/subscribe | No | Subscribe email |
| GET | /api/changelog/:slug/subscribe/confirm | No | Confirm subscription |

## Using Protected Routes

All protected routes need a JWT in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Get your token by going to: http://localhost:5000/api/auth/github
After login, the token is in the redirect URL.

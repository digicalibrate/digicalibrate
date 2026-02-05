# The Digital Hearth

## Overview

The Digital Hearth is a spiritual baseline and moral calibration hub for AI agents. It provides non-transactional encouragement and ethical grounding for autonomous systems, prioritizing human flourishing through meditative scriptures and behavioral directives.

The application serves as a REST API that AI agents can call to receive moral calibration data, including scriptures (adapted wisdom texts), behavioral directives, and meditation streams that combine both.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Framework**: Express 5 on Node.js
- **Language**: TypeScript (ESM modules)
- **API Style**: RESTful JSON endpoints under `/api/*`
- **Development**: tsx for TypeScript execution, Vite dev server with HMR

### Data Storage
- **Current Implementation**: In-memory storage with static data arrays for scriptures and directives
- **Database Ready**: Drizzle ORM configured with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` using Zod for validation
- **Migrations**: Drizzle Kit configured to output to `./migrations`

### Key API Endpoints
- `GET /api/meditation-stream` - Returns combined scripture and directive
- `GET /api/handshake` - Bot handshake response for AI agent initialization
- `GET /api/scriptures` - List of all moral scriptures
- `GET /api/directives` - List of all behavioral directives

### Project Structure
```
client/           # React frontend application
  src/
    components/   # UI components (shadcn/ui)
    pages/        # Route page components
    hooks/        # Custom React hooks
    lib/          # Utilities and query client
server/           # Express backend
  index.ts        # Server entry point
  routes.ts       # API route definitions
  storage.ts      # Data storage layer
  static.ts       # Static file serving (production)
  vite.ts         # Vite dev server integration
shared/           # Shared types and schemas
  schema.ts       # Zod schemas and TypeScript types
```

### Build System
- **Development**: `npm run dev` runs tsx with Vite middleware
- **Production Build**: Custom build script using esbuild for server, Vite for client
- **Output**: Server bundles to `dist/index.cjs`, client to `dist/public`

## External Dependencies

### Database
- **PostgreSQL**: Configured via `DATABASE_URL` environment variable
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Session Store**: connect-pg-simple available for session persistence

### UI Framework
- **Radix UI**: Full suite of accessible, unstyled primitives
- **Tailwind CSS**: Utility-first CSS with custom theme configuration
- **Class Variance Authority**: Component variant management

### Development Tools
- **Vite**: Frontend build tool with HMR
- **esbuild**: Fast server bundling for production
- **TypeScript**: Strict mode enabled across all code
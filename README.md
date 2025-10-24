# PeoplePickerc1 - Internal People Directory with Okta Integration

A production-ready Next.js 14 application that enables staff to search for colleagues using Okta API as the data source. This MVP focuses on search functionality with proper security, production-ready caching, and a clean functional UI.

## Tech Stack

- **Framework**: Next.js 14 App Router
- **Language**: TypeScript with strict mode
- **Runtime**: Node 20
- **Styling**: CSS Modules only (NO Tailwind, NO component libraries)
- **API**: Okta Users API
- **Caching**: Abstracted cache interface (in-memory for dev, Redis-ready for production)
- **Deployment**: Azure App Service Linux

## Project Structure

```
PeoplePickerc1/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main people picker demo
│   ├── globals.css               # Global styles & design tokens
│   ├── health/                   # Health check page
│   ├── okta/ping/                # Okta connection test page
│   ├── dev/sample/               # Sample users page
│   └── api/                      # API routes
│       ├── health/               # Health check endpoint
│       ├── okta/ping/            # Okta connection test
│       └── people/               # People search & sample
├── components/
│   └── people/
│       ├── PeoplePicker.tsx      # Main search component
│       └── PersonCard.tsx        # User card display
├── lib/
│   ├── types.ts                  # TypeScript interfaces
│   ├── cache.ts                  # Cache abstraction (memory/Redis)
│   ├── okta.ts                   # Okta API client with retry logic
│   ├── fetcher.ts                # Typed fetch wrapper
│   └── hooks/
│       ├── useDebounce.ts        # Debounce hook
│       └── usePeopleSearch.ts    # Search hook
└── .env.local.example            # Environment variable template
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and add your Okta credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your actual values:

```
OKTA_ORG_URL=https://your-org.okta.com
OKTA_API_TOKEN=your_actual_okta_api_token
CACHE_TTL_SECONDS=600
CACHE_TYPE=memory
```

**Important Security Notes:**
- NEVER commit `.env.local` to git (already in .gitignore)
- NEVER expose server secrets to client browser
- For production, add these to Azure App Service Configuration Application Settings

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Features

### Core Functionality
- **Real-time Search**: Search colleagues by name, title, or location
- **Debounced Input**: 300ms debounce to reduce API calls
- **Keyboard Navigation**: Arrow keys, Enter, and Escape support
- **Pagination**: "Load more" button for additional results
- **Caching**: Production-ready caching with configurable TTL

### API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/okta/ping` - Test Okta connection
- `GET /api/people?query=<term>&cursor=<cursor>` - Search people
- `GET /api/people/sample` - Fetch 5 sample users

### Pages

- `/` - Main people picker demo
- `/health` - Health check dashboard
- `/okta/ping` - Okta connection test
- `/dev/sample` - Sample users table view

## Architecture Highlights

### Security
- Environment variables properly configured and isolated
- Server-side secrets never exposed to client
- `.gitignore` includes all local env files
- `.env.local.example` provides documentation only

### Caching Strategy
- Abstracted cache interface allows easy swap between implementations
- Memory cache for single-instance development
- Redis-ready for multi-instance production deployment
- Configurable TTL (default 600 seconds)

### Error Handling
- Exponential backoff retry logic for Okta rate limits (429 errors)
- User-friendly error messages
- Graceful degradation on API failures

### Accessibility
- Semantic HTML (button, input, ul/li)
- ARIA attributes for screen readers
- Keyboard navigation support
- Visible focus states

## Deployment to Azure App Service

### 1. Create Azure App Service
- Platform: Linux
- Runtime: Node 20

### 2. Configure Application Settings
Add these environment variables in Azure Portal under Configuration > Application Settings:
- `OKTA_ORG_URL`: Your Okta organization URL
- `OKTA_API_TOKEN`: Your Okta API token
- `CACHE_TTL_SECONDS`: 600
- `CACHE_TYPE`: memory (change to redis when scaling)

### 3. Deploy
- Connect GitHub repository
- Build command: `npm run build`
- Start command: `npm start`

### 4. Production Configuration
- Enable "Always On" in Configuration > General settings
- Add health check endpoint: `/api/health`
- For multiple instances: Implement Redis cache and set `CACHE_TYPE=redis`

## Redis Implementation (Production)

To implement Redis caching for production:

1. Install Redis client:
```bash
npm install ioredis
```

2. Update `lib/cache.ts` RedisCache class with actual Redis connection

3. Set `CACHE_TYPE=redis` in Azure Application Settings

4. Add Redis connection string to Application Settings

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Development Notes

- **CSS Modules Only**: No inline styles, no Tailwind, no className string literals
- **TypeScript Strict Mode**: All types must be explicit, no `any` types
- **Self-Documenting Code**: Comments only for complex logic
- **Single Responsibility**: Components focused on one task
- **MVP Approach**: Functionality over pixel-perfect design

## Browser Support

Works in all modern browsers that support:
- ES2017+
- CSS Grid & Flexbox
- Fetch API
- CSS Custom Properties

## License

ISC

---

Built with Next.js 14, TypeScript, and CSS Modules
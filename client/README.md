# Client

Next.js frontend for portfolio analysis.

## Structure

```
app/                 # Pages & routes
components/          # UI components
lib/                 # API client & utils
types/               # TypeScript definitions
```

## Environment

Auto-detects API endpoints:

- Local: `localhost:3001`
- Remote: `montyapi.marc.tt`

Override: `NEXT_PUBLIC_API_URL=http://localhost:3001`

## Usage

```bash
npm run dev    # http://localhost:3000
npm run build
```

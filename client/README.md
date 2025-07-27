# Monty Client

## Environment Configuration

Auto-detects environment and connects to appropriate server:

- Local: `localhost:3000` → `localhost:3001`
- Remote: `monty.marc.tt` → `montyapi.marc.tt`

Override with `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

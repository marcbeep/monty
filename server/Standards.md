# Coding Standards

## Structure

```
src/
├── config/     # Environment, DB config
├── controllers/ # Route handlers
├── dto/        # Request/Response types
├── middleware/ # Express middleware
├── services/   # Business logic
├── utils/      # Shared utilities
└── database/   # SQL schemas
```

## Naming

- **Database**: `snake_case`
- **TypeScript**: `camelCase`
- **Files**: `kebab-case.ts`
- **Constants**: `UPPER_SNAKE_CASE`

## Error Handling

```typescript
// Use factory functions
throw BadRequest("Invalid input");
throw Unauthorized("No token");
throw NotFound("User not found");

// Handle in middleware
if (error instanceof AppError) {
  res.status(error.statusCode).json({ success: false, error: error.message });
}
```

## Validation

```typescript
// Zod schemas only
export const userSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
});
```

## Response Format

```typescript
// Success
res.json({ success: true, data: result });

// Error
res.status(400).json({ success: false, error: "message" });
```

## Database

- Direct service → Supabase calls
- No repository pattern
- RLS policies on all tables
- Triggers for auto-timestamps

## No

- ❌ Verbose comments
- ❌ Multiple error classes
- ❌ Repository abstraction
- ❌ Model classes
- ❌ Duplicate type definitions

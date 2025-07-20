# Pre-commit Hook Setup

This project uses [Husky](https://typicode.github.io/husky/) to run a pre-commit hook that ensures code quality and prevents broken builds from being committed.

## What's Configured

### Pre-commit Hook (`client/.husky/pre-commit`)

Runs before each commit and will **block the commit** if any checks fail:

1. **ESLint**: Runs `eslint --fix` on staged TypeScript/JavaScript files to auto-fix common issues
2. **Build Check**: Runs `npm run build` to ensure no compilation errors

## How It Works

When you run `git commit`:

```bash
# 1. Lint staged files and auto-fix issues
npx lint-staged

# 2. Run full build to catch any errors
npm run build

# 3. If all pass, commit proceeds
# 4. If any fail, commit is blocked
```

**That's it!** Simple and effective. No delays when pushing to remote.

## Setup Requirements

### Already Configured

- ✅ Husky installed and configured
- ✅ lint-staged installed and configured
- ✅ Pre-commit hook created and executable

### Manual Setup (if needed)

If hooks aren't working, run:

```bash
cd client
npm run prepare  # Installs husky hooks
chmod +x .husky/pre-commit
```

## Bypassing Hook (Emergency Only)

If you need to bypass the hook in an emergency:

```bash
git commit --no-verify -m "emergency fix"
```

**⚠️ Use sparingly!** Bypassing hooks can introduce broken code to the repository.

## Troubleshooting

### Hook not running

```bash
# Make sure hook is executable
chmod +x .husky/pre-commit

# Ensure husky is properly installed
npm run prepare
```

### ESLint errors

```bash
# Run lint manually to see errors
npm run lint

# Auto-fix what's possible
npm run lint -- --fix
```

### Build errors

```bash
# Run build manually to see errors
npm run build

# Check TypeScript errors
npx tsc --noEmit
```

## Benefits

1. **Prevents broken builds** from being committed
2. **Automatic code formatting** via ESLint --fix
3. **Consistent code quality** across all team members
4. **Catches issues early** when they're easy to fix
5. **Simple workflow** - one checkpoint, no delays

## Why Not Pre-push?

We intentionally keep it simple with **pre-commit only**:

- ✅ Catches issues early when you can easily fix them
- ✅ No delays when pushing (faster workflow)
- ✅ Simpler mental model - one quality gate
- ✅ Industry standard approach
- ✅ If pre-commit passes, push should work fine

## Customization

To modify what runs in the hook, edit:

- `client/.husky/pre-commit` - Commands that run before commit
- `client/package.json` - lint-staged configuration

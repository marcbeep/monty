# Pre-commit and Pre-push Hooks Setup

This project uses [Husky](https://typicode.github.io/husky/) to run Git hooks that ensure code quality and prevent broken builds from being committed or pushed.

## What's Configured

### Pre-commit Hook (`client/.husky/pre-commit`)

Runs before each commit and will **block the commit** if any checks fail:

1. **ESLint**: Runs `eslint --fix` on staged TypeScript/JavaScript files
2. **Build Check**: Runs `npm run build` to ensure no compilation errors

### Pre-push Hook (`client/.husky/pre-push`)

Runs before pushing to remote and will **block the push** if build fails:

1. **Final Build Check**: Runs `npm run build` one more time before pushing

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

When you run `git push`:

```bash
# 1. Run final build check
npm run build

# 2. If build succeeds, push proceeds
# 3. If build fails, push is blocked
```

## Setup Requirements

### Already Configured

- ✅ Husky installed and configured
- ✅ lint-staged installed and configured
- ✅ Pre-commit and pre-push hooks created
- ✅ Hooks are executable

### Manual Setup (if needed)

If hooks aren't working, run:

```bash
cd client
npm run prepare  # Installs husky hooks
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
```

## Bypassing Hooks (Emergency Only)

If you need to bypass hooks in an emergency:

```bash
# Skip pre-commit hook
git commit --no-verify -m "emergency fix"

# Skip pre-push hook
git push --no-verify
```

**⚠️ Use sparingly!** Bypassing hooks can introduce broken code to the repository.

## Troubleshooting

### Hook not running

```bash
# Make sure hooks are executable
chmod +x .husky/pre-commit .husky/pre-push

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

1. **Prevents broken builds** from being committed or pushed
2. **Automatic code formatting** via ESLint --fix
3. **Consistent code quality** across all team members
4. **Catches issues early** before they reach CI/CD or other developers
5. **Saves time** by preventing failed builds in CI/CD pipelines

## Customization

To modify what runs in hooks, edit:

- `client/.husky/pre-commit` - Commands that run before commit
- `client/.husky/pre-push` - Commands that run before push
- `client/package.json` - lint-staged configuration

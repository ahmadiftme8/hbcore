# Bun NestJS Template

A modern [NestJS](https://nestjs.com/) template powered by [Bun.js](https://bun.sh/) runtime and [Biome.js](https://biomejs.dev/) for linting and formatting.

## Features

- 🚀 **Bun.js** - Fast JavaScript runtime, bundler, and package manager
- 🏗️ **NestJS** - Progressive Node.js framework for building efficient server-side applications
- ✨ **Biome.js** - Fast formatter and linter (replaces ESLint and Prettier)
- 📦 **TypeScript** - Full TypeScript support out of the box
- 🧪 **Jest** - Testing framework configured and ready to use

## Prerequisites

- [Bun](https://bun.sh/) installed (version 1.0.0 or higher)

## Getting Started

### Installation

```bash
bun install
```

### Development

```bash
# Start the application in development mode
bun run start:dev

# Start the application
bun run start
```

The application will be available at `http://localhost:3000`

### Building

```bash
# Build the application
bun run build

# Start in production mode
bun run start:prod
```

## Code Quality

This template uses [Biome.js](https://biomejs.dev/) for linting and formatting.

```bash
# Check code formatting and linting
bun run check

# Auto-fix formatting and linting issues
bun run check:fix

# Format code only
bun run format

# Lint code only
bun run lint
```

## Testing

```bash
# Unit tests
bun run test

# Watch mode
bun run test:watch

# Test coverage
bun run test:cov

# E2E tests
bun run test:e2e
```

## Project Structure

```
.
├── src/
│   ├── main.ts           # Application entry point
│   ├── app.module.ts     # Root module
│   ├── app.controller.ts # Example controller
│   └── app.service.ts    # Example service
├── test/                 # E2E tests
├── biome.json            # Biome configuration
├── nest-cli.json         # NestJS CLI configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## Available Scripts

- `bun run build` - Build the application
- `bun run start` - Start the application (uses Bun)
- `bun run start:dev` - Start in development mode with watch
- `bun run start:prod` - Start in production mode (uses Bun)
- `bun run format` - Format code with Biome
- `bun run format:check` - Check code formatting
- `bun run lint` - Lint code with Biome
- `bun run lint:fix` - Lint and fix code with Biome
- `bun run check` - Check formatting and linting
- `bun run check:fix` - Auto-fix formatting and linting
- `bun run test` - Run unit tests
- `bun run test:watch` - Run tests in watch mode
- `bun run test:cov` - Run tests with coverage
- `bun run test:e2e` - Run E2E tests

## Why Bun?

- **Fast**: Bun is significantly faster than Node.js for many operations
- **Native TypeScript**: No need for ts-node or compilation step in development
- **Built-in bundler**: No need for webpack or other bundlers
- **Fast package manager**: Bun's package manager is faster than npm/yarn/pnpm

## Why Biome?

- **Fast**: Biome is written in Rust and is significantly faster than ESLint/Prettier
- **All-in-one**: Replaces both ESLint and Prettier with a single tool
- **Zero config**: Works out of the box with sensible defaults
- **TypeScript support**: First-class TypeScript support

## Learn More

- [NestJS Documentation](https://docs.nestjs.com)
- [Bun Documentation](https://bun.sh/docs)
- [Biome Documentation](https://biomejs.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## License

MIT

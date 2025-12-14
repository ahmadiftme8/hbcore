# Stage 1: Dependencies
FROM oven/bun:latest AS deps
WORKDIR /app

# Copy root package files for workspace setup
COPY package.json bun.lock* ./

# Copy workspace package files
COPY packages/db/package.json ./packages/db/
COPY packages/types/package.json ./packages/types/

# Install dependencies
RUN bun install

# Stage 2: Production
FROM oven/bun:latest AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid 1001 dbuser

# Copy workspace dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy db package source files (needed for migrations)
COPY --chown=dbuser:nodejs packages/db ./packages/db
COPY --chown=dbuser:nodejs packages/types ./packages/types

# Copy root package.json and tsconfig.json for workspace resolution
COPY --chown=dbuser:nodejs package.json ./
COPY --chown=dbuser:nodejs tsconfig.json ./

USER dbuser

# Default command: run migrations
CMD ["bun", "run", "--cwd", "packages/db", "migration:run"]


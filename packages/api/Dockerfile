# Stage 1: Dependencies
FROM oven/bun:latest AS deps
WORKDIR /app

# Copy root package files for workspace setup
COPY package.json bun.lock* ./

# Copy workspace package files
COPY packages/api/package.json ./packages/api/
COPY packages/db/package.json ./packages/db/
COPY packages/types/package.json ./packages/types/
COPY packages/unleash/package.json ./packages/unleash/

# Install dependencies
# Remove --frozen-lockfile to allow lockfile updates if needed
# For production, ensure bun.lock is committed and up to date
RUN bun install

# Stage 2: Builder
FROM oven/bun:latest AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy workspace configuration
COPY package.json bun.lock* ./
COPY tsconfig.json ./

# Copy workspace packages needed for build
COPY packages/types ./packages/types
COPY packages/db ./packages/db
COPY packages/unleash ./packages/unleash
COPY packages/api ./packages/api

# Build API application
WORKDIR /app/packages/api
RUN bun run build

# Stage 3: Production
FROM oven/bun:latest AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid 1001 nestjs

# Copy workspace dependencies (only production)
COPY --from=deps /app/node_modules ./node_modules

# Copy workspace packages (only what's needed at runtime)
# Types and db packages are TypeScript-only, so copy source files
COPY --from=builder --chown=nestjs:nodejs /app/packages/types ./packages/types
COPY --from=builder --chown=nestjs:nodejs /app/packages/db ./packages/db
COPY --from=builder --chown=nestjs:nodejs /app/packages/unleash ./packages/unleash
# Copy built API application
COPY --from=builder --chown=nestjs:nodejs /app/packages/api/dist ./packages/api/dist
COPY --from=builder --chown=nestjs:nodejs /app/packages/api/package.json ./packages/api/
COPY --from=builder --chown=nestjs:nodejs /app/packages/api/tsconfig.json ./packages/api/

# Copy root package.json for workspace resolution
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./

USER nestjs

EXPOSE 3001

ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

WORKDIR /app/packages/api

# Run the built NestJS application
CMD ["bun", "run", "dist/main.js"]


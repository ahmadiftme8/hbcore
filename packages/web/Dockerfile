# Stage 1: Dependencies
FROM oven/bun:latest AS deps
WORKDIR /app

# Copy root package files for workspace setup
COPY package.json bun.lock* ./
COPY packages/web/package.json ./packages/web/
COPY packages/types/package.json ./packages/types/

# Install dependencies
# Remove --frozen-lockfile to allow lockfile updates if needed
# For production, ensure bun.lock is committed and up to date
RUN bun install

# Stage 2: Builder
FROM oven/bun:latest AS builder
WORKDIR /app

# Accept build arguments for NEXT_PUBLIC_* variables
# These are required at build time as Next.js embeds them in the bundle
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
ARG NEXT_PUBLIC_API_URL

# Set as environment variables for Next.js build process
ENV NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY}
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID}
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}
ENV NEXT_PUBLIC_FIREBASE_APP_ID=${NEXT_PUBLIC_FIREBASE_APP_ID}
ENV NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=${NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy workspace configuration
COPY package.json bun.lock* ./
COPY tsconfig.json ./

# Copy workspace packages needed for build
COPY packages/types ./packages/types

# Copy web package source files
COPY packages/web ./packages/web

# Build Next.js application
WORKDIR /app/packages/web
RUN bun run build

# Stage 3: Production
FROM oven/bun:latest AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid 1001 nextjs

# Copy standalone output from builder
# Next.js standalone mode creates a minimal server in .next/standalone
# The structure mirrors the monorepo, so server.js will be in packages/web/
COPY --from=builder --chown=nextjs:nodejs /app/packages/web/.next/standalone ./
# Copy static files to the correct location relative to where server.js runs
COPY --from=builder --chown=nextjs:nodejs /app/packages/web/.next/static ./packages/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/packages/web/public ./packages/web/public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Next.js standalone creates server.js in the same relative path as the source
# For monorepo structure: packages/web/server.js
WORKDIR /app/packages/web

# Use bun to run the standalone server
CMD ["bun", "server.js"]


# Production Dockerfile for BSF WhatsApp Service
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json tsconfig.json ./
RUN npm ci

# Copy TypeScript source files
COPY src/ ./src/

# Compile TypeScript
RUN npm run build

# --- Production Runner ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
# Default port if not provided by host/container environment
ENV PORT=3000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled code from builder
COPY --from=builder /app/dist ./dist

# Create persistent auth_info directory with proper permissions
RUN mkdir -p /app/auth_info && chown -R node:node /app/auth_info

USER node

# Mount point for persistent WhatsApp credentials volume
VOLUME ["/app/auth_info"]

EXPOSE $PORT

CMD ["node", "dist/server.js"]

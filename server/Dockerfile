# ── Stage 1: Build Frontend ─────────────────────────
FROM node:20-alpine AS client-builder
WORKDIR /app

# Accept build arguments for frontend env vars (defaults to relative paths for single-origin prod)
ARG VITE_API_BASE_URL=/api/v1
ARG VITE_SOCKET_URL=/

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

COPY client/package*.json ./client/
RUN cd client && npm ci

COPY client/ ./client/
RUN cd client && npm run build

# ── Stage 2: Production Server ──────────────────────
FROM node:20-alpine AS runner
WORKDIR /app/server
ENV NODE_ENV=production

COPY server/package*.json ./
RUN npm ci --omit=dev

COPY server/ ./
COPY --from=client-builder /app/client/dist /app/client/dist

EXPOSE 8000

CMD ["npm", "start"]

# -----------------------------
# 🏗 Stage 1: Builder
# -----------------------------
FROM node:23-slim AS builder

ENV HUSKY=0
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Prisma client generado en build (no se necesita Prisma CLI en runtime)
RUN npx prisma generate --schema=apps/__projectName__/prisma/schema.prisma

RUN npm run build __projectName__
RUN npm run build proto

# -----------------------------
# 🚀 Stage 2: Runtime
# -----------------------------
FROM node:23-slim AS runtime

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN apt-get update -y && apt-get install -y openssl

ENV NODE_ENV=production \
    PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

WORKDIR /app

# ─── Copiar dependencias ────────
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# ─── Copiar Prisma schema y client generado ────────
COPY --from=builder /app/apps/__projectName__/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# ─── Copiar código compilado ────────
COPY --from=builder /app/dist/libs/proto/src/__projectName__ ./dist/libs/proto/src/__projectName__
COPY --from=builder /app/dist/apps/__projectName__/src ./dist/apps/__projectName__/src

# ─── Healthcheck ────────
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=3 \
    CMD nc -z localhost ${SERVICE_PORT} || exit 1

# ─── Iniciar app ────────
CMD ["node", "./dist/apps/__projectName__/src/main"]

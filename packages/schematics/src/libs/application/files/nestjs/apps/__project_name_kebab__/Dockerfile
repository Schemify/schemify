# -----------------------------
# 🏗 Stage 1: Builder
# -----------------------------
FROM node:23-slim AS builder

ENV HUSKY=0
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# ✅ Solo generar Prisma __project_name_camel__ (sin aplicar migraciones)
RUN npx prisma generate --schema=apps/__project_name_kebab__/prisma/schema.prisma

# ✅ Compilar código
RUN npm run build __project_name_kebab__
RUN npm run build proto

# -----------------------------
# 🚀 Stage 2: Runtime
# -----------------------------
FROM node:23-slim AS runtime

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN apt-get update -y && apt-get install -y openssl netcat-openbsd

ENV NODE_ENV=production \
    PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

WORKDIR /app

# ─── Copiar dependencias ────────
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# ─── Copiar Prisma schema y migraciones ────────
COPY --from=builder /app/apps/__project_name_kebab__/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# ─── Copiar código compilado ────────
COPY --from=builder /app/dist ./dist

# ─── Copiar entrypoint ────────
COPY scripts/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# ─── Healthcheck ────────
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=3 \
    CMD nc -z localhost ${SERVICE_PORT} || exit 1

# ─── Entrypoint ────────
ENTRYPOINT ["./entrypoint.sh"]

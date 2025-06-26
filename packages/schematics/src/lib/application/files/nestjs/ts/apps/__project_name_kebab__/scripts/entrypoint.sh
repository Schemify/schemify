#!/bin/sh

set -e

echo "📡 Esperando a la base de datos ($project_name_screaming_DATABASE_URL)..."
until nc -z $(echo $project_name_screaming_DATABASE_URL | sed -E 's|.*//([^:/]+):?([0-9]*)/.*|\1 \2|'); do
  echo "⏳ Esperando conexión..."
  sleep 2
done

echo "🔁 Generando Prisma Client (por seguridad)..."
npx prisma generate --schema=prisma/schema.prisma

echo "🚀 Aplicando migraciones (si hay)..."
npx prisma migrate deploy --schema=prisma/schema.prisma

echo "✅ Iniciando aplicación..."
exec node dist/apps/__project_name_kebab__/src/main

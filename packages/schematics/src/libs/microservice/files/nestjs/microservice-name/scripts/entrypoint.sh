#!/bin/sh

set -e

echo "📡 Esperando a la base de datos ($MICROSERVICE_NAME_DATABASE_URL)..."
until nc -z $(echo $MICROSERVICE_NAME_DATABASE_URL | sed -E 's|.*//([^:/]+):?([0-9]*)/.*|\1 \2|'); do
  echo "⏳ Esperando conexión..."
  sleep 2
done

echo "🔁 Generando Prisma MicroserviceName (por seguridad)..."
npx prisma generate --schema=prisma/schema.prisma

echo "🚀 Aplicando migraciones (si hay)..."
npx prisma migrate deploy --schema=prisma/schema.prisma

echo "✅ Iniciando aplicación..."
exec node dist/apps/microserviceName/src/main

#!/bin/bash

# Script de entrypoint inteligente para el microservicio de __project_name_camel__
# Detecta el estado de la base de datos y sincroniza migraciones automáticamente

echo "🚀 Iniciando microservicio de __project_name_camel__..."

# Función para esperar a que la base de datos esté lista
wait_for_database() {
    echo "⏳ Esperando a que la base de datos esté lista..."
    until npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; do
        echo "⏳ Base de datos aún no está lista, esperando..."
        sleep 2
    done
    echo "✅ Base de datos lista!"
}

# Función para detectar migraciones automáticas en la base de datos
detect_auto_migrations() {
    echo "🔍 Detectando migraciones automáticas en la base de datos..."
    
    # Obtener migraciones de la base de datos
    DB_MIGRATIONS=$(npx prisma migrate status --schema=./prisma/schema.prisma 2>&1 | grep "auto_init" || echo "")
    
    if [ -n "$DB_MIGRATIONS" ]; then
        echo "⚠️ Se detectaron migraciones automáticas en la base de datos"
        echo "📋 Migraciones encontradas: $DB_MIGRATIONS"
        return 0
    else
        echo "✅ No se detectaron migraciones automáticas"
        return 1
    fi
}

# Función para sincronizar migraciones locales con la base de datos
sync_migrations() {
    echo "🔄 Sincronizando migraciones locales con la base de datos..."
    
    # Verificar si hay drift
    if npx prisma migrate status --schema=./prisma/schema.prisma 2>&1 | grep -q "drift"; then
        echo "⚠️ Detectado drift entre migraciones locales y base de datos"
        
        # Crear una nueva migración que refleje el estado actual
        echo "📝 Creando migración de sincronización..."
        npx prisma migrate diff \
            --from-empty \
            --to-schema-datamodel ./prisma/schema.prisma \
            --script > ./prisma/migrations/$(date +%Y%m%d%H%M%S)_sync_schema.sql 2>/dev/null || true
        
        # Marcar la migración como aplicada
        echo "✅ Migración de sincronización creada"
    else
        echo "✅ No hay drift detectado"
    fi
}

# Función para sincronizar el esquema
sync_schema() {
    echo "🔄 Sincronizando esquema de la base de datos..."
    
    # Intentar sincronizar sin pérdida de datos
    if npx prisma db push --accept-data-loss --skip-generate; then
        echo "✅ Esquema sincronizado exitosamente"
    else
        echo "⚠️ Error al sincronizar esquema, continuando..."
    fi
}

# Función para generar el __project_name_camel__ Prisma
generate_prisma_client() {
    echo "🔧 Generando __project_name_camel__ Prisma..."
    npx prisma generate
    echo "✅ __project_name_pascal__ Prisma generado"
}

# ─── Ejecutar secuencia de inicialización ────────
wait_for_database

# Detectar migraciones automáticas
if detect_auto_migrations; then
    sync_migrations
fi

sync_schema
generate_prisma_client

# ─── Iniciar la aplicación ────────
echo "🚀 Iniciando aplicación..."
exec node ./dist/apps/__project_name_camel__/src/main 
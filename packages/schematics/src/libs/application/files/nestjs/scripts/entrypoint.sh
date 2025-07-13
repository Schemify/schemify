#!/bin/bash

# Smart entrypoint script for the microservice-name microservice
# Detects the database state and automatically syncs Prisma migrations and compiles proto files

echo "🚀 Starting microservice-name microservice..."

# Detect auto-applied migrations
detect_auto_migrations() {
    echo "🔍 Checking for auto-applied migrations in the database..."
    
    DB_MIGRATIONS=$(npx prisma migrate status --schema=./prisma/schema.prisma 2>&1 | grep "auto_init" || echo "")
    
    if [ -n "$DB_MIGRATIONS" ]; then
        echo "⚠️ Auto-applied migrations detected"
        echo "📋 Found migrations: $DB_MIGRATIONS"
        return 0
    else
        echo "✅ No auto-applied migrations found"
        return 1
    fi
}

# Sync local migrations with the database
sync_migrations() {
    echo "🔄 Syncing local migrations with the database..."
    
    if npx prisma migrate status --schema=./prisma/schema.prisma 2>&1 | grep -q "drift"; then
        echo "⚠️ Drift detected between local and remote schema"
        
        echo "📝 Generating drift synchronization migration..."
        npx prisma migrate diff \
            --from-empty \
            --to-schema-datamodel ./prisma/schema.prisma \
            --script > ./prisma/migrations/$(date +%Y%m%d%H%M%S)_sync_schema.sql 2>/dev/null || true
        
        echo "✅ Synchronization migration created"
    else
        echo "✅ No drift detected"
    fi
}

# Sync Prisma schema with the database
sync_schema() {
    echo "🔄 Pushing schema to the database..."
    
    if npx prisma db push --accept-data-loss --skip-generate; then
        echo "✅ Schema successfully pushed"
    else
        echo "⚠️ Failed to push schema, continuing..."
    fi
}

# Generate Prisma client
generate_prisma_client() {
    echo "🔧 Generating Prisma client for microservice-name..."
    npx prisma generate
    echo "✅ Prisma client generated for MicroserviceName"
}

# Compile .proto files
compile_proto_files() {
    echo "📦 Compiling .proto files..."
    sh ./scripts/compile-protos.sh
}

# ─── Run all setup steps ────────

if detect_auto_migrations; then
    sync_migrations
fi

sync_schema
generate_prisma_client
compile_proto_files

# ─── Start the application ────────
echo "🚀 Starting application..."
exec node ./dist/apps/microservice-name/src/main.js

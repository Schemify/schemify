#!/bin/bash

# Smart entrypoint script for a microservice
# Detects the database state and automatically syncs Prisma migrations and compiles proto files

PROJECT_NAME=$1

if [ -z "$PROJECT_NAME" ]; then
    echo "❌ Error: Missing project name"
    echo "Usage: ./entrypoint.sh <project_name_kebab>"
    exit 1
fi

SCHEMA_PATH=apps/$PROJECT_NAME/prisma/schema.prisma
MAIN_FILE=dist/apps/$PROJECT_NAME/src/main.js

echo "🚀 Starting microservice: $PROJECT_NAME"

# Detect auto-applied migrations
detect_auto_migrations() {
    echo "🔍 Checking for auto-applied migrations..."
    
    DB_MIGRATIONS=$(npx prisma migrate status --schema=$SCHEMA_PATH 2>&1 | grep "auto_init" || echo "")
    
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
    
    if npx prisma migrate status --schema=$SCHEMA_PATH 2>&1 | grep -q "drift"; then
        echo "⚠️ Drift detected"
        
        echo "📝 Generating synchronization migration..."
        npx prisma migrate diff \
            --from-empty \
            --to-schema-datamodel $SCHEMA_PATH \
            --script > ./prisma/migrations/$(date +%Y%m%d%H%M%S)_sync_schema.sql 2>/dev/null || true
        
        echo "✅ Sync migration created"
    else
        echo "✅ No drift detected"
    fi
}

# Push schema to the database
sync_schema() {
    echo "🔄 Pushing schema to the database..."
    
    if npx prisma db push --schema=$SCHEMA_PATH --accept-data-loss --skip-generate; then
        echo "✅ Schema pushed successfully"
    else
        echo "⚠️ Schema push failed, continuing..."
    fi
}

# Generate Prisma client
generate_prisma_client() {
    echo "🔧 Generating Prisma client for $PROJECT_NAME..."
    npx prisma generate --schema=$SCHEMA_PATH
    echo "✅ Prisma client generated"
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
exec node $MAIN_FILE

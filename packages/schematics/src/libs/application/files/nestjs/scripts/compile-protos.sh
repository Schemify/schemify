#!/bin/bash

set -e

PROTO_SRC="libs/proto/src"
PROTO_OUT="libs/proto/generated"
INDEX_FILE="$PROTO_OUT/index.ts"

echo "🧼 Cleaning output directory..."
rm -rf "$PROTO_OUT"
mkdir -p "$PROTO_OUT"
echo "// Auto-generated exports" > "$INDEX_FILE"

echo "🔍 Searching for .proto files in $PROTO_SRC..."

find "$PROTO_SRC" -name "*.proto" | while read -r PROTO_FILE; do
  REL_PATH="${PROTO_FILE#$PROTO_SRC/}"
  MODULE_PATH="./$(dirname "$REL_PATH")/$(basename "$REL_PATH" .proto)"

  # Intentar extraer el nombre del package del archivo .proto
  PACKAGE_NAME=$(grep '^package ' "$PROTO_FILE" | sed 's/package \(.*\);/\1/' | tr '-' '_' | tr '.' '_')

  # Fallback: usar nombre basado en directorio si no se encuentra package
  EXPORT_NAME=${PACKAGE_NAME:-$(dirname "$REL_PATH" | tr '/' '_' | tr '-' '_')}

  echo "📦 Compiling: $REL_PATH → $PROTO_OUT"

  npx protoc \
    --ts_proto_out="$PROTO_OUT" \
    --ts_proto_opt=nestJs=true,outputFlatten=false \
    -I "$PROTO_SRC" \
    "$PROTO_FILE"

  echo "export * as $EXPORT_NAME from '$MODULE_PATH'" >> "$INDEX_FILE"
done

echo "✅ Protobuf files compiled successfully."

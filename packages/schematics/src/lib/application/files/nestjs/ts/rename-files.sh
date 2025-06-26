#!/bin/bash

# Script simple de renombramiento masivo
# Uso: ./rename-simple.sh "patron_antiguo" "patron_nuevo"

if [ $# -ne 2 ]; then
    echo "Uso: $0 'patron_antiguo' 'patron_nuevo'"
    echo "Ejemplo: $0 'project_name_pascals' 'project_name_pascal'"
    exit 1
fi

OLD=$1
NEW=$2

echo "🔄 Reemplazando '$OLD' por '$NEW' en todos los archivos..."

# Reemplazar en contenido de archivos
find . -type f \( -name "*.ts" -o -name "*.js" -o -name "*.json" -o -name "*.proto" -o -name "*.md" \) \
    -not -path "./node_modules/*" \
    -not -path "./.git/*" \
    -exec sed -i "s/$OLD/$NEW/g" {} \;

# Renombrar archivos
find . -name "*$OLD*" -not -path "./node_modules/*" -not -path "./.git/*" | while read file; do
    newfile=$(echo "$file" | sed "s/$OLD/$NEW/g")
    if [ "$file" != "$newfile" ]; then
        mv "$file" "$newfile"
        echo "Renombrado: $file -> $newfile"
    fi
done

echo "✅ Renombramiento completado"
#!/bin/bash

# Script de renombramiento global (contenido + nombres de archivos y carpetas)
# Uso: ./rename-global.sh "nombre_antiguo" "nombre_nuevo"

if [ $# -ne 2 ]; then
    echo "Uso: $0 'nombre_antiguo' 'nombre_nuevo'"
    echo "Ejemplo: $0 'micromicro' 'usuarios'"
    exit 1
fi

OLD=$1
NEW=$2

echo "🔄 Reemplazando '$OLD' por '$NEW' en el contenido de todos los archivos..."

# Reemplazar en contenido de todos los archivos (sin importar extensión)
find . -type f \
  -not -path "./node_modules/*" \
  -not -path "./.git/*" \
  -exec sed -i "s/$OLD/$NEW/g" {} \;

echo "🔄 Renombrando archivos y carpetas que contienen '$OLD'..."

# Renombrar archivos y carpetas (archivos primero, carpetas después)
find . -depth -name "*$OLD*" \
  -not -path "./node_modules/*" \
  -not -path "./.git/*" | while read path; do
    newpath=$(echo "$path" | sed "s/$OLD/$NEW/g")
    if [ "$path" != "$newpath" ]; then
        mv "$path" "$newpath"
        echo "Renombrado: $path -> $newpath"
    fi
done

echo "✅ Renombramiento global completado."

#!/bin/bash

echo "🚀 Iniciando bootstrap de Schemify..."

# ─────────────────────────────────────────────
# Ir al directorio raíz del proyecto
cd "$(dirname "$0")"

# ─────────────────────────────────────────────
# Instalar dependencias de core
echo "📦 Instalando dependencias de @schemifyjs/core..."
cd packages/core
npm install

# Compilar core
echo "🏗️  Compilando @schemifyjs/core..."
npm run build

# Linkear core globalmente
echo "🔗 Linkeando @schemifyjs/core localmente..."
npm link

# ─────────────────────────────────────────────
# Instalar dependencias de cli
echo "📦 Instalando dependencias de @schemify/cli..."
cd ../cli
npm install

# Linkear core dentro de CLI
echo "🔗 Linkeando @schemifyjs/core dentro de @schemify/cli..."
npm link @schemifyjs/core

# Compilar CLI
echo "🏗️  Compilando @schemify/cli..."
npm run build

# Hacer CLI ejecutable globalmente
echo "🔗 Registrando CLI global (schemify)..."
npm link

echo "✅ Bootstrap completo. Ahora puedes ejecutar:"
echo "   schemify"

#!/bin/bash

# Script para ejecutar pruebas del sistema con Docker
# Este script levanta los servicios necesarios y ejecuta las pruebas e2e

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes con colores
print_message() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Función para limpiar recursos
cleanup() {
    print_message "Limpiando recursos..."
    
    # Detener contenedores si están ejecutándose
    if docker ps -q --filter "name=microserviceName-test" | grep -q .; then
        docker stop $(docker ps -q --filter "name=microserviceName-test")
    fi
    
    # Remover contenedores si existen
    if docker ps -aq --filter "name=microserviceName-test" | grep -q .; then
        docker rm $(docker ps -aq --filter "name=microserviceName-test")
    fi
    
    print_success "Limpieza completada"
}

# Función para verificar dependencias
check_dependencies() {
    print_message "Verificando dependencias..."
    
    # Verificar Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker no está instalado"
        exit 1
    fi
    
    # Verificar Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose no está instalado"
        exit 1
    fi
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js no está instalado"
        exit 1
    fi
    
    # Verificar npm
    if ! command -v npm &> /dev/null; then
        print_error "npm no está instalado"
        exit 1
    fi
    
    print_success "Todas las dependencias están instaladas"
}

# Función para levantar servicios de prueba
start_test_services() {
    print_message "Levantando servicios de prueba..."
    
    # Crear red de Docker si no existe
    if ! docker network ls | grep -q "microserviceName-test-net"; then
        docker network create microserviceName-test-net
    fi
    
    # Levantar servicios usando docker-compose.test.yml
    docker-compose -f docker-compose.test.yml up -d --remove-orphans
    
    # Esperar a que la base de datos esté lista
    print_message "Esperando a que la base de datos esté lista..."
    timeout=30
    counter=0
    while ! docker exec microserviceName-test-db pg_isready -U postgres &> /dev/null; do
        if [ $counter -ge $timeout ]; then
            print_error "Timeout esperando la base de datos"
            exit 1
        fi
        sleep 1
        counter=$((counter + 1))
    done
    
    # Esperar a que Kafka esté listo
    print_message "Esperando a que Kafka esté listo..."
    timeout=30
    counter=0
    while ! docker exec kafka-test kafka-topics --bootstrap-server localhost:9092 --list &> /dev/null; do
        if [ $counter -ge $timeout ]; then
            print_error "Timeout esperando Kafka"
            exit 1
        fi
        sleep 1
        counter=$((counter + 1))
    done
    
    # Crear topic de prueba si no existe
    docker exec kafka-test kafka-topics --create --if-not-exists \
        --bootstrap-server localhost:9092 \
        --replication-factor 1 \
        --partitions 1 \
        --topic microserviceName.created
    
    docker exec kafka-test kafka-topics --create --if-not-exists \
        --bootstrap-server localhost:9092 \
        --replication-factor 1 \
        --partitions 1 \
        --topic microserviceName.updated
    
    print_success "Servicios de prueba levantados correctamente"
}

# Función para ejecutar migraciones de prueba
run_test_migrations() {
    print_message "Ejecutando migraciones de prueba..."
    
    # Generar microserviceName Prisma
    npm run db:generate
    
    # Ejecutar migraciones
    npm run db:migrate
    
    print_success "Migraciones completadas"
}

# Función para ejecutar pruebas
run_tests() {
    local test_type=${1:-"e2e"}
    
    print_message "Ejecutando pruebas de tipo: $test_type"
    
    case $test_type in
        "e2e"|"system")
            npm run test:e2e
            ;;
        "unit")
            npm run test:unit
            ;;
        "integration")
            npm run test:integration
            ;;
        "all")
            npm run test:all
            ;;
        *)
            print_error "Tipo de prueba no válido: $test_type"
            print_message "Tipos válidos: e2e, system, unit, integration, all"
            exit 1
            ;;
    esac
}

# Función para mostrar ayuda
show_help() {
    echo "Script para ejecutar pruebas del sistema"
    echo ""
    echo "Uso: $0 [OPCIONES] [TIPO_PRUEBA]"
    echo ""
    echo "OPCIONES:"
    echo "  -h, --help          Mostrar esta ayuda"
    echo "  -s, --services-only Solo levantar servicios (no ejecutar pruebas)"
    echo "  -c, --cleanup       Solo limpiar recursos"
    echo "  -d, --debug         Ejecutar pruebas en modo debug"
    echo ""
    echo "TIPO_PRUEBA:"
    echo "  e2e|system          Pruebas end-to-end del sistema (por defecto)"
    echo "  unit                Pruebas unitarias"
    echo "  integration         Pruebas de integración"
    echo "  all                 Todas las pruebas"
    echo ""
    echo "EJEMPLOS:"
    echo "  $0                  # Ejecutar pruebas e2e"
    echo "  $0 e2e             # Ejecutar pruebas e2e"
    echo "  $0 unit            # Ejecutar pruebas unitarias"
    echo "  $0 -d e2e          # Ejecutar pruebas e2e en modo debug"
    echo "  $0 -s              # Solo levantar servicios"
    echo "  $0 -c              # Solo limpiar recursos"
}

# Variables por defecto
SERVICES_ONLY=false
CLEANUP_ONLY=false
DEBUG_MODE=false
TEST_TYPE="e2e"

# Parsear argumentos
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -s|--services-only)
            SERVICES_ONLY=true
            shift
            ;;
        -c|--cleanup)
            CLEANUP_ONLY=true
            shift
            ;;
        -d|--debug)
            DEBUG_MODE=true
            shift
            ;;
        e2e|system|unit|integration|all)
            TEST_TYPE="$1"
            shift
            ;;
        *)
            print_error "Argumento desconocido: $1"
            show_help
            exit 1
            ;;
    esac
done

# Función principal
main() {
    print_message "Iniciando script de pruebas del sistema..."
    
    # Verificar dependencias
    check_dependencies
    
    # Configurar trap para limpiar recursos al salir
    trap cleanup EXIT INT TERM
    
    if [ "$CLEANUP_ONLY" = true ]; then
        cleanup
        exit 0
    fi
    
    # Levantar servicios
    start_test_services
    
    if [ "$SERVICES_ONLY" = true ]; then
        print_success "Servicios levantados. Ejecuta las pruebas manualmente."
        print_message "Para limpiar recursos, ejecuta: $0 -c"
        # Mantener el script ejecutándose para que los servicios sigan corriendo
        while true; do
            sleep 1
        done
    fi
    
    # Ejecutar migraciones
    run_test_migrations
    
    # Ejecutar pruebas
    if [ "$DEBUG_MODE" = true ]; then
        case $TEST_TYPE in
            "e2e"|"system")
                npm run test:e2e:debug
                ;;
            "unit")
                npm run test:unit:watch
                ;;
            "integration")
                npm run test:integration:watch
                ;;
            "all")
                npm run test:all:watch
                ;;
        esac
    else
        run_tests "$TEST_TYPE"
    fi
    
    print_success "Pruebas completadas exitosamente"
}

# Ejecutar función principal
main "$@"

echo "🧪 Setting up test environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Stop any existing test containers
echo "🛑 Stopping existing test containers..."
docker-compose -f docker-compose.test.yml down -v 2>/dev/null || true

# Start test infrastructure
echo "🚀 Starting test infrastructure..."
docker-compose -f docker-compose.test.yml up -d microserviceName-test-db kafka-test

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until docker exec microserviceName-test-db pg_isready -U postgres > /dev/null 2>&1; do
    echo "   Waiting for PostgreSQL..."
    sleep 2
done

# Wait for Kafka to be ready
echo "⏳ Waiting for Kafka to be ready..."
until docker exec kafka-test kafka-topics --bootstrap-server localhost:9092 --list > /dev/null 2>&1; do
    echo "   Waiting for Kafka..."
    sleep 2
done

echo "✅ Test environment is ready!"

# Set environment variables for tests
export project_name_screaming_DATABASE_URL="postgresql://postgres:postgres@localhost:5434/__project_name_kebab___test"
export KAFKA_BROKERS="localhost:9094"
export NODE_ENV="test"

echo "📋 Environment variables set:"
echo "   project_name_screaming_DATABASE_URL: $project_name_screaming_DATABASE_URL"
echo "   KAFKA_BROKERS: $KAFKA_BROKERS"
echo "   NODE_ENV: $NODE_ENV"

echo ""
echo "🎯 You can now run: npm run test:integration" 
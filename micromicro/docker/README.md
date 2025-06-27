# Docker - Schemify Monorepo

Estructura organizada de Docker para el monorepo Schemify.

## 📁 Estructura

```
docker/
├── micromicro/              # Microservicio de micromicro
│   ├── docker-compose.yml
│   ├── env.example        # Variables específicas del servicio
│   └── README.md
├── databases/
│   └── micromicro-db/       # Base de datos PostgreSQL
│       ├── docker-compose.yml
│       ├── env.example
│       └── README.md
└── kafka/                 # Kafka
    └── docker-compose.yml
```

## 🚀 Servicios Disponibles

### 1. **Microservicio Micromicro**
- **Ubicación**: `docker/micromicro/`
- **Puerto**: 3001 (configurable)
- **gRPC**: 50051 (configurable)
- **Dependencias**: PostgreSQL, Kafka

### 2. **Base de Datos PostgreSQL**
- **Ubicación**: `docker/databases/micromicro-db/`
- **Puerto**: 5432 (configurable)
- **Base de datos**: micromicro_db
- **Usuario**: micromicro_user

### 3. **Kafka**
- **Ubicación**: `docker/kafka/`
- **Puerto**: 9092
- **Broker**: kafka1:9092

## 🔧 Configuración de Variables de Entorno

### **Estrategia Híbrida (Buenas Prácticas)**

#### **1. Variables Globales** (`env.example` en la raíz)
Para configuración compartida entre servicios:
```env
# Variables de base de datos
MICROMICRO_DB_NAME=micromicro_db
MICROMICRO_DB_USER=micromicro_user
MICROMICRO_DB_PASSWORD=micromicro_password_secure
MICROMICRO_DATABASE_URL=postgresql://${MICROMICRO_DB_USER}:${MICROMICRO_DB_PASSWORD}@postgres-micromicro:5432/${MICROMICRO_DB_NAME}

# Variables de Kafka
KAFKA_BROKERS=kafka1:9092
KAFKA_CLIENT_ID=schemify-producer
```

#### **2. Variables Específicas por Servicio** (`docker/micromicro/env.example`)
Para configuración única de cada servicio:
```env
# Configuración específica del microservicio
MICROMICRO_SERVICE_PORT=3001
MICROMICRO_GRPC_PORT=50051
SERVICE_APP_NAME=micromicro
LOG_LEVEL=info
```

### **Setup de Variables**

```bash
# 1. Copiar variables globales
cp env.example .env

# 2. Copiar variables específicas del servicio
cp docker/micromicro/env.example docker/micromicro/.env

# 3. Editar según necesidades
nano .env
nano docker/micromicro/.env
```

### **Redes Docker**
Crear las redes necesarias:

```bash
docker network create postgres-net
docker network create kafka-shared-net
```

## 📋 Comandos

### Gestión Individual
```bash
# Base de datos
npm run up:database:micromicro
npm run down:database:micromicro

# Kafka
npm run up:kafka
npm run down:kafka

# Microservicio
npm run up:micromicro
npm run down:micromicro
```

### Gestión Completa
```bash
# Levantar todo
npm run up:all

# Detener todo
npm run down:all
```

## 🔄 Orden de Despliegue

1. **Configurar variables**: `cp env.example .env && cp docker/micromicro/env.example docker/micromicro/.env`
2. **Crear redes**: `docker network create postgres-net && docker network create kafka-shared-net`
3. **Levantar base de datos**: `npm run up:database:micromicro`
4. **Levantar Kafka**: `npm run up:kafka`
5. **Levantar microservicio**: `npm run up:micromicro`

O simplemente: `npm run up:all`

## 🔍 Monitoreo

### Ver logs
```bash
# Base de datos
docker logs postgres-micromicro

# Microservicio
docker logs micromicro-prod

# Kafka
docker logs kafka1
```

### Conectar a base de datos
```bash
docker exec -it postgres-micromicro psql -U micromicro_user -d micromicro_db
```

## 🛠️ Desarrollo

### Variables de Entorno para Desarrollo
```env
# Globales (.env)
NODE_ENV=development
MICROMICRO_DB_PORT=5432
DEBUG=true

# Específicas (docker/micromicro/.env)
MICROMICRO_SERVICE_PORT=3001
MICROMICRO_GRPC_PORT=50051
LOG_LEVEL=debug
```

### Testing
```bash
# Unit tests
npm run test:unit

# Integration tests (requiere base de datos)
npm run up:database:micromicro
npm run test:integration
```

## 🎯 Ventajas de esta Estrategia

- ✅ **Separación de responsabilidades**: Globales vs específicas
- ✅ **Reutilización**: Variables globales compartidas
- ✅ **Flexibilidad**: Cada servicio puede tener su configuración
- ✅ **Mantenibilidad**: Fácil de gestionar y actualizar
- ✅ **Seguridad**: Variables sensibles centralizadas 
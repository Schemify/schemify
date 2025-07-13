# Docker - Schemify Monorepo

Estructura organizada de Docker para el monorepo Schemify.

## 📁 Estructura

```
docker/
├── microserviceName/              # Microservicio de microserviceName
│   ├── docker-compose.yml
│   ├── env.example        # Variables específicas del servicio
│   └── README.md
├── databases/
│   └── microserviceName-db/       # Base de datos PostgreSQL
│       ├── docker-compose.yml
│       ├── env.example
│       └── README.md
└── kafka/                 # Kafka
    └── docker-compose.yml
```

## 🚀 Servicios Disponibles

### 1. **Microservicio MicroserviceName**
- **Ubicación**: `docker/microserviceName/`
- **Puerto**: 3001 (configurable)
- **gRPC**: 50051 (configurable)
- **Dependencias**: PostgreSQL, Kafka

### 2. **Base de Datos PostgreSQL**
- **Ubicación**: `docker/databases/microserviceName-db/`
- **Puerto**: 5432 (configurable)
- **Base de datos**: microservice-name_db
- **Usuario**: microservice-name_user

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
MICROSERVICE_NAME_DB_NAME=microservice-name_db
MICROSERVICE_NAME_DB_USER=microservice-name_user
MICROSERVICE_NAME_DB_PASSWORD=microservice-name_password_secure
MICROSERVICE_NAME_DATABASE_URL=postgresql://${MICROSERVICE_NAME_DB_USER}:${MICROSERVICE_NAME_DB_PASSWORD}@postgres-microserviceName:5432/${MICROSERVICE_NAME_DB_NAME}

# Variables de Kafka
KAFKA_BROKERS=kafka1:9092
KAFKA_CLIENT_ID=schemify-producer
```

#### **2. Variables Específicas por Servicio** (`docker/microserviceName/env.example`)
Para configuración única de cada servicio:
```env
# Configuración específica del microservicio
MICROSERVICE_NAME_SERVICE_PORT=3001
MICROSERVICE_NAME_GRPC_PORT=50051
SERVICE_APP_NAME=microserviceName
LOG_LEVEL=info
```

### **Setup de Variables**

```bash
# 1. Copiar variables globales
cp env.example .env

# 2. Copiar variables específicas del servicio
cp docker/microserviceName/env.example docker/microserviceName/.env

# 3. Editar según necesidades
nano .env
nano docker/microserviceName/.env
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
npm run up:database:microserviceName
npm run down:database:microserviceName

# Kafka
npm run up:kafka
npm run down:kafka

# Microservicio
npm run up:microserviceName
npm run down:microserviceName
```

### Gestión Completa
```bash
# Levantar todo
npm run up:all

# Detener todo
npm run down:all
```

## 🔄 Orden de Despliegue

1. **Configurar variables**: `cp env.example .env && cp docker/microserviceName/env.example docker/microserviceName/.env`
2. **Crear redes**: `docker network create postgres-net && docker network create kafka-shared-net`
3. **Levantar base de datos**: `npm run up:database:microserviceName`
4. **Levantar Kafka**: `npm run up:kafka`
5. **Levantar microservicio**: `npm run up:microserviceName`

O simplemente: `npm run up:all`

## 🔍 Monitoreo

### Ver logs
```bash
# Base de datos
docker logs postgres-microserviceName

# Microservicio
docker logs microserviceName-prod

# Kafka
docker logs kafka1
```

### Conectar a base de datos
```bash
docker exec -it postgres-microserviceName psql -U microservice-name_user -d microservice-name_db
```

## 🛠️ Desarrollo

### Variables de Entorno para Desarrollo
```env
# Globales (.env)
NODE_ENV=development
MICROSERVICE_NAME_DB_PORT=5432
DEBUG=true

# Específicas (docker/microserviceName/.env)
MICROSERVICE_NAME_SERVICE_PORT=3001
MICROSERVICE_NAME_GRPC_PORT=50051
LOG_LEVEL=debug
```

### Testing
```bash
# Unit tests
npm run test:unit

# Integration tests (requiere base de datos)
npm run up:database:microserviceName
npm run test:integration
```

## 🎯 Ventajas de esta Estrategia

- ✅ **Separación de responsabilidades**: Globales vs específicas
- ✅ **Reutilización**: Variables globales compartidas
- ✅ **Flexibilidad**: Cada servicio puede tener su configuración
- ✅ **Mantenibilidad**: Fácil de gestionar y actualizar
- ✅ **Seguridad**: Variables sensibles centralizadas 
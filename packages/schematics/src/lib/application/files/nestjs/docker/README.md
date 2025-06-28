# Docker - Schemify Monorepo

Estructura organizada de Docker para el monorepo Schemify.

## 📁 Estructura

```
docker/
├── __project_name_camel__/              # Microservicio de __project_name_camel__
│   ├── docker-compose.yml
│   ├── env.example        # Variables específicas del servicio
│   └── README.md
├── databases/
│   └── __project_name_camel__-db/       # Base de datos PostgreSQL
│       ├── docker-compose.yml
│       ├── env.example
│       └── README.md
└── kafka/                 # Kafka
    └── docker-compose.yml
```

## 🚀 Servicios Disponibles

### 1. **Microservicio __project_name_pascal__**
- **Ubicación**: `docker/__project_name_camel__/`
- **Puerto**: 3001 (configurable)
- **gRPC**: 50051 (configurable)
- **Dependencias**: PostgreSQL, Kafka

### 2. **Base de Datos PostgreSQL**
- **Ubicación**: `docker/databases/__project_name_camel__-db/`
- **Puerto**: 5432 (configurable)
- **Base de datos**: __project_name_kebab___db
- **Usuario**: __project_name_kebab___user

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
__project_name_screaming___DB_NAME=__project_name_kebab___db
__project_name_screaming___DB_USER=__project_name_kebab___user
__project_name_screaming___DB_PASSWORD=__project_name_kebab___password_secure
__project_name_screaming___DATABASE_URL=postgresql://${__project_name_screaming___DB_USER}:${__project_name_screaming___DB_PASSWORD}@postgres-__project_name_camel__:5432/${__project_name_screaming___DB_NAME}

# Variables de Kafka
KAFKA_BROKERS=kafka1:9092
KAFKA_CLIENT_ID=schemify-producer
```

#### **2. Variables Específicas por Servicio** (`docker/__project_name_camel__/env.example`)
Para configuración única de cada servicio:
```env
# Configuración específica del microservicio
__project_name_screaming___SERVICE_PORT=3001
__project_name_screaming___GRPC_PORT=50051
SERVICE_APP_NAME=__project_name_camel__
LOG_LEVEL=info
```

### **Setup de Variables**

```bash
# 1. Copiar variables globales
cp env.example .env

# 2. Copiar variables específicas del servicio
cp docker/__project_name_camel__/env.example docker/__project_name_camel__/.env

# 3. Editar según necesidades
nano .env
nano docker/__project_name_camel__/.env
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
npm run up:database:__project_name_camel__
npm run down:database:__project_name_camel__

# Kafka
npm run up:kafka
npm run down:kafka

# Microservicio
npm run up:__project_name_camel__
npm run down:__project_name_camel__
```

### Gestión Completa
```bash
# Levantar todo
npm run up:all

# Detener todo
npm run down:all
```

## 🔄 Orden de Despliegue

1. **Configurar variables**: `cp env.example .env && cp docker/__project_name_camel__/env.example docker/__project_name_camel__/.env`
2. **Crear redes**: `docker network create postgres-net && docker network create kafka-shared-net`
3. **Levantar base de datos**: `npm run up:database:__project_name_camel__`
4. **Levantar Kafka**: `npm run up:kafka`
5. **Levantar microservicio**: `npm run up:__project_name_camel__`

O simplemente: `npm run up:all`

## 🔍 Monitoreo

### Ver logs
```bash
# Base de datos
docker logs postgres-__project_name_camel__

# Microservicio
docker logs __project_name_camel__-prod

# Kafka
docker logs kafka1
```

### Conectar a base de datos
```bash
docker exec -it postgres-__project_name_camel__ psql -U __project_name_kebab___user -d __project_name_kebab___db
```

## 🛠️ Desarrollo

### Variables de Entorno para Desarrollo
```env
# Globales (.env)
NODE_ENV=development
__project_name_screaming___DB_PORT=5432
DEBUG=true

# Específicas (docker/__project_name_camel__/.env)
__project_name_screaming___SERVICE_PORT=3001
__project_name_screaming___GRPC_PORT=50051
LOG_LEVEL=debug
```

### Testing
```bash
# Unit tests
npm run test:unit

# Integration tests (requiere base de datos)
npm run up:database:__project_name_camel__
npm run test:integration
```

## 🎯 Ventajas de esta Estrategia

- ✅ **Separación de responsabilidades**: Globales vs específicas
- ✅ **Reutilización**: Variables globales compartidas
- ✅ **Flexibilidad**: Cada servicio puede tener su configuración
- ✅ **Mantenibilidad**: Fácil de gestionar y actualizar
- ✅ **Seguridad**: Variables sensibles centralizadas 
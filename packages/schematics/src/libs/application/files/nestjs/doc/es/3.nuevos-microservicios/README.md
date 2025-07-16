# 📦 Crear un nuevo microservicio en el monorepo

Este documento detalla paso a paso la creación de un nuevo microservicio basado en NestJS, siguiendo arquitectura hexagonal, DDD, gRPC y Kafka, usando Prisma y PostgreSQL.


## 🧱 Estructura del microservicio

Ubicación: `apps/__project_name_kebab__`

Contiene:

* Prisma schema y migraciones
* Estructura `src/` con carpetas `microservice`, `libs/shared`, etc.
* Controladores gRPC, consumidores Kafka, eventos, CQRS, mappers, repositorios Prisma y módulos in/out bounds


## 🐘 Base de datos y Docker

1. Crear carpeta: `docker/postgresql-__project_name_kebab__`
2. Incluir `docker-compose.yml` y `.env.example` para:

   ```dotenv
   __project_name_screaming___DATABASE_NAME=__project_name_camel__
   __project_name_screaming___DATABASE_USER=__project_name_kebab___user
   __project_name_screaming___DATABASE_PASSWORD=__project_name_kebab___password_secure
   __project_name_screaming___DATABASE_PORT=5432
   ```
3. Asociar la red:

   ```yaml
   networks:
     dbnet-postgres-__project_name_kebab__:
       name: dbnet-postgres-__project_name_kebab__
       driver: bridge
   ```


## 🧪 Agregar comandos en package.json

Agregar a `scripts`:

```json
"__project_name_camel__:up": "docker compose -f ./apps/__project_name_kebab__/docker-compose.yml up --build -d",
"__project_name_camel__:down": "docker compose -f ./apps/__project_name_kebab__/docker-compose.yml down",
"__project_name_camel__:db:up": "docker compose -f ./docker/postgresql-__project_name_kebab__/docker-compose.yml up --build -d",
"__project_name_camel__:db:down": "docker compose -f ./docker/postgresql-__project_name_kebab__/docker-compose.yml down",
"__project_name_camel__:up:all": "npm run __project_name_camel__:db:up && npm run __project_name_camel__:up",
"__project_name_camel__:down:all": "npm run __project_name_camel__:down && npm run __project_name_camel__:db:down"
```


## 🔧 Configuración Nest CLI y TSConfig

### `nest-cli.json`

Agregar al bloque `projects`:

```json
"__project_name_kebab__": {
  "type": "application",
  "root": "apps/__project_name_kebab__",
  "entryFile": "src/main",
  "sourceRoot": "./",
  "compilerOptions": {
    "tsConfigPath": "apps/__project_name_kebab__/tsconfig.app.json",
    "assets": ["libs/proto/src/*.proto"],
    "watchAssets": true
  }
}
```

### `tsconfig.json`

Agregar al bloque `paths`:

```json
"@__project_name_camel__/*": ["apps/__project_name_kebab__/src/*"]
```

## 🎯 Compilación de contratos gRPC

Agregar archivo `.proto` en:

```
libs/proto/src/events/__project_name_kebab__/__project_name_kebab__-events.proto
```

Ejemplo:

```proto
syntax = "proto3";
package __project_name_snake___events;

message __project_name_pascal__CreatedEvent {
  string id = 1;
  string name = 2;
  optional string description = 3;
  string createdAt = 4;
  optional string updatedAt = 5;
}
```

Compilar con:

```bash
npx protoc \
  --plugin=../../../node_modules/.bin/protoc-gen-ts_proto.cmd \
  --ts_proto_out=../generated/event-contracts \
  --ts_proto_opt=nestJs=true \
  event-contracts/__project_name_kebab__-events.proto
```

## ✨ Consideraciones adicionales

* Reutiliza Kafka broker y Kafka UI ya existentes.
* Cada microservicio debe tener su propia base de datos PostgreSQL.
* Los eventos deben definirse en contratos `.proto`.
* Cada microservicio debe tener su `Dockerfile`, `.env.example`, y `docker-compose.yml`.

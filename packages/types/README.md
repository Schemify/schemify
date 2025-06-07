# @schemify/types

> 📦 Shared TypeScript contracts and interfaces for the [Schemify](https://github.com/Schemify/schemify-microservice) ecosystem.

[English](#english) | [Español](#español)

---

## English

### 📚 Overview

`@schemify/types` is the canonical source of shared types and contracts used across all Schemify-based microservices.

It ensures strong typing, interoperability, and consistency between:

- gRPC DTOs
- Kafka messages
- Domain events
- Common utility types (e.g. pagination, errors)

---

### 📦 Installation

```bash
npm install @schemify/types
````

---

### 🧠 Usage

Import types in your microservices or libraries:

```ts
import { CreateExampleDto, ExampleEvent } from '@schemify/types';
```

All types are generated or curated to match the shared protocol contracts defined in the repo [`schemify-microservice`](https://github.com/Schemify/schemify-microservice).

---

### 🔧 Structure

```
@schemify/types
├── grpc/
│   ├── example.proto.ts
│   └── ...
├── kafka/
│   ├── events/
│   ├── topics.ts
│   └── ...
├── common/
│   ├── pagination.ts
│   ├── error.ts
│   └── ...
└── index.ts
```

---

## Español

### 📚 Descripción

`@schemify/types` es el paquete central de tipos y contratos compartidos entre todos los microservicios basados en Schemify.

Asegura un tipado fuerte, interoperabilidad y coherencia entre:

* DTOs para gRPC
* Mensajes Kafka
* Eventos de dominio
* Tipos comunes (paginación, errores, etc.)

---

### 📦 Instalación

```bash
npm install @schemify/types
```

---

### 🧠 Uso

Importa los tipos en tus microservicios o librerías:

```ts
import { CreateExampleDto, ExampleEvent } from '@schemify/types';
```

Los tipos están alineados con los contratos definidos en el repositorio [`schemify-microservice`](https://github.com/Schemify/schemify-microservice).

---

### 🔧 Estructura

```
@schemify/types
├── grpc/
│   ├── example.proto.ts
│   └── ...
├── kafka/
│   ├── events/
│   ├── topics.ts
│   └── ...
├── common/
│   ├── pagination.ts
│   ├── error.ts
│   └── ...
└── index.ts
```

---

> ✅ Ideal for monorepos, package sharing, and scalable microservice boundaries.

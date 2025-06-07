# @schemify/core

> ⚙️ The internal engine behind [Schemify CLI](https://www.npmjs.com/package/@schemify/cli).  
> 🧱 Provides scaffolding logic, templates, and generation utilities for production-ready microservices.

[English](#english) | [Español](#español)

---

## English

### 📚 Overview

`@schemify/core` is the core package used by the [`@schemify/cli`](https://www.npmjs.com/package/@schemify/cli) to generate microservices based on modern architectural patterns:

- Hexagonal Architecture
- Domain-Driven Design
- CQRS and Event-Driven Systems

It handles all generation logic, template rendering, name validation, file system manipulation, and structural enforcement.

---

### 📦 Installation

```bash
npm install @schemify/core
````

> ⚠️ This package is designed to be used by the CLI and not directly by end users.

---

### 🛠️ Features

* ✅ File system-safe templating
* ✅ Dynamic placeholder replacement (`{{project_name}}`, etc.)
* ✅ Project-type abstraction (`grpc`, `kafka`, `microservice`)
* ✅ Ready-to-extend template directory structure:
  `core/templates/:type/`

---

### 🧱 Architecture

```
@schemify/core
├── templates/
│   └── microservice/
│       ├── apps/
│       ├── libs/
│       └── docker/
├── utils/
│   ├── validate-name.ts
│   ├── replace-placeholders.ts
│   └── copy-template.ts
└── createProject.ts
```

The `createProject` function orchestrates the full process:

1. Validates input
2. Copies template files
3. Replaces placeholders
4. Initializes Git and optionally installs deps

---

## Español

### 📚 Descripción

`@schemify/core` es el motor interno utilizado por [`@schemify/cli`](https://www.npmjs.com/package/@schemify/cli) para generar microservicios modernos:

* Arquitectura Hexagonal
* Diseño guiado por el dominio (DDD)
* CQRS y eventos con Kafka/gRPC

Se encarga de toda la lógica de generación: manipulación de archivos, render de plantillas, validaciones, e inicialización del proyecto.

---

### 📦 Instalación

```bash
npm install @schemify/core
```

> ⚠️ Este paquete está pensado para ser usado por la CLI, no directamente por usuarios finales.

---

### 🛠️ Características

* ✅ Render de plantillas sin errores de filesystem
* ✅ Reemplazo dinámico de `{{project_name}}` y más
* ✅ Soporte para tipos de proyecto: `grpc`, `kafka`, `microservice`
* ✅ Estructura modular de plantillas:
  `core/templates/:type/`

---

### 🧱 Arquitectura Interna

```
@schemify/core
├── templates/
│   └── microservice/
│       ├── apps/
│       ├── libs/
│       └── docker/
├── utils/
│   ├── validate-name.ts
│   ├── replace-placeholders.ts
│   └── copy-template.ts
└── createProject.ts
```

La función `createProject` realiza todo el flujo:

1. Valida el nombre del proyecto
2. Copia la plantilla base
3. Sustituye placeholders
4. Inicializa Git e instala dependencias (opcional)

---

### 🌐 Repositorio base

Código fuente: [github.com/Schemify/schemify-microservice](https://github.com/Schemify/schemify-microservice)

---

> Built for maintainers who care about architectural rigor.

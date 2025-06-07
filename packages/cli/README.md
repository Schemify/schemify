# Schemify CLI

> 🛠️ Modern microservice scaffolding powered by Hexagonal Architecture, DDD, CQRS, and NestJS.

[English](#english) | [Español](#español)

---

## English

### 🔗 Repository

Visit the official repository: [Schemify Microservice](https://github.com/Schemify/schemify-microservice)

### 🚀 What is Schemify CLI?

`schemify` is a CLI tool designed to scaffold production-grade Node.js microservices using best practices like:

- Hexagonal Architecture (Ports & Adapters)
- Domain-Driven Design (DDD)
- CQRS + Event-driven Messaging
- gRPC, Kafka, and Prisma ORM

It generates everything from project skeletons to use cases, entities, DTOs, and handlers.

---

### 📦 Installation

```bash
npm install -g @schemify/cli
````

---

### 📂 Usage

#### Create a new microservice:

```bash
schemify new microservice
```

You’ll be prompted for the project name and type. The CLI will:

* Copy the base template from `schemify-microservice`
* Setup module structure, gRPC contracts, Kafka topics, and Prisma schemas
* Bootstrap the project with Git and install dependencies

---

### 🧪 Example

```bash
schemify new grpc
```

Creates a gRPC-ready microservice using DDD structure inside your workspace.

---

## Español

### 🔗 Repositorio

Visita el repositorio oficial: [Schemify Microservice](https://github.com/Schemify/schemify-microservice)

### 🚀 ¿Qué es Schemify CLI?

`schemify` es una herramienta de línea de comandos que permite generar microservicios Node.js con prácticas modernas como:

* Arquitectura Hexagonal (Puertos y Adaptadores)
* Diseño guiado por el dominio (DDD)
* CQRS + Eventos con Kafka
* gRPC y Prisma ORM

Genera automáticamente la estructura completa: entidades, casos de uso, módulos, DTOs y handlers.

---

### 📦 Instalación

```bash
npm install -g @schemify/cli
```

---

### 📂 Uso

#### Crear un nuevo microservicio:

```bash
schemify new microservice
```

El CLI te preguntará el nombre y tipo del proyecto. Luego:

* Copia la plantilla base de `schemify-microservice`
* Configura módulos, contratos gRPC, tópicos Kafka y Prisma
* Inicializa Git e instala las dependencias

---

### 🧪 Ejemplo

```bash
schemify new kafka
```

Crea un microservicio orientado a eventos con Kafka y CQRS.

---

### 👀 Repositorio base

Todo se genera desde el template oficial:
**[https://github.com/Schemify/schemify-microservice](https://github.com/Schemify/schemify-microservice)**

---

### 🧠 Tips

* Usa `--help` para ver todos los comandos
* La CLI valida nombres y estructuras automáticamente
* Compatible con monorepos y workspaces
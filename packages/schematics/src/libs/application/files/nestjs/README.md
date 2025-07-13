<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://schemify.github.io/schemify.com/assets/img/logos/schemify-logo.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Development-orange" alt="Estado del proyecto: En desarrollo" />
  <img src="https://img.shields.io/badge/NestJS-%5E11.x-E0234E?logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Kafka-Bitnami-black?logo=apachekafka" />
  <img src="https://img.shields.io/badge/gRPC-ts--proto-6f42c1?logo=grpc" />
  <img src="https://img.shields.io/badge/Prisma-%5E6.x-2D3748?logo=prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-%5E15.x-4169E1?logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker" />
  <img src="https://img.shields.io/badge/DDD-Hexagonal-green" />
</p>


## 📄 Descripción

Este microservicio forma parte del ecosistema **Schemify**. Implementa una arquitectura moderna basada en:

- NestJS + CQRS
- Domain-Driven Design (DDD) + Hexagonal
- Comunicación sincrónica vía gRPC
- Comunicación asíncrona vía Kafka
- Prisma ORM + PostgreSQL
- Tests locales y de integración (testcontainers)

---

## ⚙️ Instalación Inicial

```bash
# Instalar dependencias
npm install

# Generar Prisma Client
npm run prisma:generate

# Generar contratos gRPC desde .proto
npm run proto:generate
````

---

## 🚀 Compilación y Ejecución

```bash
# Desarrollo local
npm run start:dev

# Producción
npm run start:prod
```

---

## 🐳 Docker / Entorno Completo

Para levantar todos los servicios necesarios (DB + Kafka + Kafka UI + Microservicio):

```bash
npm run __project_name_camel__:up:all
```

Para detenerlos completamente:

```bash
npm run __project_name_camel__:down:all
```

> Asegúrate de que no haya conflictos de puertos antes de ejecutar estos comandos.

---

## 🧪 Pruebas

```bash
# Unitarias
npm run test

# Integración con testcontainers
npm run test:testcontainers

# End-to-End
npm run test:e2e
```

---

## 📦 Estructura del Proyecto

* `src/microservice/application`: comandos, queries y eventos del dominio
* `src/microservice/domain`: entidades, value objects y eventos
* `src/microservice/infrastructure`: controladores gRPC/Kafka, adaptadores Prisma, productores Kafka
* `libs/shared`: configuración global, interfaces comunes
* `prisma/schema.prisma`: definición de modelo relacional con Prisma

---

## 🔌 Comunicación gRPC

```bash
# Para regenerar los contratos gRPC
npm run proto:generate
```

Los servicios gRPC están definidos en archivos `.proto` y generados automáticamente con `ts-proto`.

---

## 📡 Exploración Kafka

Puedes observar los mensajes emitidos por Kafka:

* **UI Web**: [http://localhost:8081](http://localhost:8081)
* **CLI Kafka Bitnami**:

```bash
docker exec -it kafka1 kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic __project_name_camel__-created \
  --from-beginning
```

---

## 🧠 Buenas prácticas

* DDD aplicado en toda la estructura
* Separación por **puertos y adaptadores** (hexagonal architecture)
* Eventos de dominio desacoplados mediante Kafka
* Casos de uso orquestados por CQRS
* Adaptadores inbounds/outbounds desacoplados

---

## 👤 Autor

**Alejandro Díaz**
Estudiante de Ingeniería Civil Informática - Universidad de Valparaíso

* GitHub: [IxyzDev](https://github.com/IxyzDev)
* LinkedIn: [in/ixyzdev](https://www.linkedin.com/in/ixyzdev/)

<p align="center">
  <em>Schemify Microservice</em> - Diseñado para ser simple, robusto y escalable. ✨
</p>

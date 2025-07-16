## 📘 Índice Maestro de Extensión y Arquitectura del Microservicio

Este documento resume, organiza y referencia todas las secciones necesarias para preparar, desplegar, entender y extender el microservicio basado en Schemify.

---

### 🧱 Parte 1: Preparación del entorno

| Nº  | Sección                                          | Propósito                                                            |
| --- | ------------------------------------------------ | -------------------------------------------------------------------- |
| 1   | [Preparación de ambiente](#preparacion-ambiente) | Configura el entorno para desarrollo local                           |
| 2   | [Variables de entorno](#variables-entorno)       | Variables mínimas requeridas para ejecución                          |
| 3   | [Manejo de configuración](#configuracion-global) | Configuración común: puertos, Kafka, Prisma, mapeadores, validadores |

---

### 🚀 Parte 2: Despliegue del microservicio

| Nº  | Sección                                        | Propósito                                                     |
| --- | ---------------------------------------------- | ------------------------------------------------------------- |
| 4   | [Despliegue del microservicio](#despliegue)    | Levanta todos los servicios en entorno productivo o local     |
| 5   | [Estructura de carpetas](#estructura-carpetas) | Organización interna del microservicio (Hexagonal, DDD, CQRS) |

---

### 🧠 Parte 3: Modelado del dominio

| Nº  | Sección                                   | Propósito                                           |
| --- | ----------------------------------------- | --------------------------------------------------- |
| 6   | [Entidad o Value Object](#entidad-o-vo)   | Representa conceptos del dominio con reglas propias |
| 7   | [Repositorio Prisma](#repositorio-prisma) | Implementa acceso a datos según contratos definidos |
| 8   | [Mapper](#mapper)                         | Transforma entidades ↔ DTOs gRPC                    |

---

### 📡 Parte 4: Contratos y casos de uso

| Nº  | Sección                                   | Propósito                                              |
| --- | ----------------------------------------- | ------------------------------------------------------ |
| 9   | [Definición `.proto`](#definicion-proto)  | Agrega una nueva operación o entidad al contrato gRPC  |
| 10  | [Comando CQRS (escritura)](#comando-cqrs) | Ejecuta una acción que modifica el estado del sistema  |
| 11  | [Consulta CQRS (lectura)](#consulta-cqrs) | Recupera datos sin alterar el estado del sistema       |
| 12  | [Evento de Dominio](#evento-dominio)      | Representa un cambio relevante en el modelo de negocio |

---

### 🔌 Parte 5: Interfaces y comunicación

| Nº  | Sección                                       | Propósito                                            |
| --- | --------------------------------------------- | ---------------------------------------------------- |
| 13  | [Controlador gRPC](#controlador-grpc)         | Expone el microservicio mediante operaciones gRPC    |
| 14  | [Consumidor Kafka](#consumidor-kafka)         | Escucha eventos emitidos por otros servicios         |
| 15  | [Publicador Kafka](#publicador-kafka)         | Emite un evento al broker Kafka desde el sistema     |
| 16  | [Controladores de entrada](#entrada-adapters) | Interfaces gRPC/Kafka expuestas por el microservicio |
| 17  | [Adaptadores de salida](#salida-adapters)     | Prisma y Kafka como puertos de salida                |


---

### ⚙️ Parte 8: Herramientas y extensibilidad

| Nº  | Sección                           | Propósito                                       |
| --- | --------------------------------- | ----------------------------------------------- |
| 21  | [Scripts útiles](#scripts-utiles) | Scripts npm y comandos personalizados definidos |

---

### 🌐 Parte 9: Documentación complementaria

| Nº  | Sección                                                      | Propósito                                                 |
| --- | ------------------------------------------------------------ | --------------------------------------------------------- |
| 23  | [Referencia a documentación externa](#documentacion-externa) | Delegación a recursos externos como Prisma, NestJS, Kafka |

# Primero infra (Kafka)
docker-compose -f infra/kafka/docker-compose.kafka.yml up -d

# Desarrollo
docker-compose --env-file docker/__projectName__/.envs/.env.dev -f docker/__projectName__/docker-compose.dev.yml up

# Producción
docker-compose --env-file docker/__projectName__/.envs/.env.prod -f docker/__projectName__/docker-compose.prod.yml up -d --build

Clean Architecture + DDD + CQRS + Hexagonal:

Dependencias unidireccionales → Dominio ← Aplicación ← Infraestructura.

Lógica de negocio dentro del dominio; controladores sólo orquestan casos de uso.

Persistencia, transporte, frameworks y mapeos quedan fuera del núcleo.


```
└── 📁schemify-nestjs
        └── COMMIT_EDITMSG
        └── config
        └── description
        └── FETCH_HEAD
        └── HEAD
        └── 📁hooks
            └── applypatch-msg.sample
            └── commit-msg.sample
            └── fsmonitor-watchman.sample
            └── post-update.sample
            └── pre-applypatch.sample
            └── pre-commit.sample
            └── pre-merge-commit.sample
            └── pre-push.sample
            └── pre-rebase.sample
            └── pre-receive.sample
            └── prepare-commit-msg.sample
            └── push-to-checkout.sample
            └── sendemail-validate.sample
            └── update.sample
    └── 📁docker
        └── 📁__projectName__
            └── 📁.envs
                └── .env.dev
                └── .env.__projectName__
                └── .env.prod
            └── docker-compose.dev.yml
            └── docker-compose.prod.yml
            └── README.md
    └── 📁docs
        └── 📁old
            └── 📁api-gateway
                └── 📁src
                    └── api-gateway.module.ts
                    └── 📁__projectName__s
                        └── constants.ts
                        └── __projectName__s.controller.ts
                        └── __projectName__s.module.ts
                        └── __projectName__s.service.ts
                    └── main.ts
                └── 📁test
                    └── app.e2e-spec.ts
                    └── jest-e2e.json
                └── tsconfig.app.json
            └── 📁microservice-__projectName__
                └── 📁docs
                    └── README.md
                └── 📁src
                    └── 📁__projectName__
                        └── 📁application
                            └── 📁dtos
                                └── create-__projectName__.dto.ts
                            └── 📁mappers
                                └── __projectName__.mapper.ts
                            └── 📁services
                                └── __projectName__-application.service.ts
                            └── 📁use-cases
                                └── create-__projectName__.use-case.ts
                        └── 📁domain
                            └── 📁entities
                                └── __projectName__.entity.ts
                            └── 📁events
                                └── __projectName__-created.event.ts
                            └── 📁repositories
                                └── __projectName__.repository.ts
                            └── 📁services
                                └── __projectName__.service.ts
                            └── 📁value-objects
                                └── description.value-object.ts
                        └── __projectName__.module.ts
                        └── 📁infraestructure
                            └── 📁config
                                └── __projectName__.config.ts
                            └── 📁controllers
                                └── __projectName__.controller.ts
                            └── 📁database
                                └── __projectName__.repository.ts
                            └── 📁exceptions
                                └── __projectName__.exception.ts
                            └── 📁grpc
                                └── 📁adapters
                                    └── __projectName__.grpc.adapter.ts
                                └── 📁generated
                                    └── __projectName__.grpc.types.ts
                                └── 📁proto
                                    └── 📁__projectName__
                                        └── __projectName__.proto
                                    └── 📁external
                                        └── external_microservice.proto
                            └── 📁modules
                                └── __projectName__.module.ts
                            └── 📁providers
                                └── __projectName__.provider.ts
                    └── main.ts
                    └── microservice-__projectName__.module.ts
                └── 📁test
                    └── app.e2e-spec.ts
                    └── jest-e2e.json
                └── tsconfig.app.json
            └── 📁schemify-nestjs
            └── 📁schemify-nestjs-consumer
                └── 📁src
                    └── app.module.ts
                    └── 📁__projectName__
                        └── __projectName__.controller.ts
                        └── __projectName__.module.ts
                        └── __projectName__.service.ts
                    └── main.ts
                └── 📁test
                    └── app.e2e-spec.ts
                    └── jest-e2e.json
                └── tsconfig.app.json
                └── 📁src
                    └── app.module.ts
                    └── 📁__projectName__
                        └── __projectName__.controller.ts
                        └── __projectName__.module.ts
                        └── __projectName__.service.ts
                    └── main.ts
                └── 📁test
                    └── app.e2e-spec.ts
                    └── jest-e2e.json
                └── tsconfig.app.json
        └── 📁prisma
            └── dev.db
            └── 📁docs
                └── README.md
            └── schema.prisma
        └── README.md
    └── 📁infra
        └── 📁kafka
            └── docker-compose.kafka.yml
    └── 📁kreya
        └── 📁__projectName__-nestjs
            └── directory.krpref
            └── 📁__projectName__
                └── directory.krpref
                └── 📁__ProjectName__Service
                    └── Create__ProjectName__-request.json
                    └── Create__ProjectName__.krop
                    └── Delete__ProjectName__-request.json
                    └── Delete__ProjectName__.krop
                    └── GetAll__ProjectName__s-request.json
                    └── GetAll__ProjectName__s.krop
                    └── Get__ProjectName__ById-request.json
                    └── Get__ProjectName__ById.krop
                    └── Get__ProjectName__sByCursor-request.json
                    └── Get__ProjectName__sByCursor.krop
                    └── Update__ProjectName__-request.json
                    └── Update__ProjectName__.krop
            └── __projectName__-nestjs.krproj
    └── 📁libs
        └── 📁proto
            └── 📁generated
                └── index.ts
                └── 📁services
                    └── 📁__projectName___service
                        └── __projectName__.ts
                        └── index.ts
                    └── index.ts
                    └── 📁prueba
                        └── index.ts
                        └── prueba.ts
            └── 📁src
                └── 📁services
                    └── 📁__projectName___service
                        └── __projectName__.proto
                    └── 📁prueba
                        └── prueba.proto
            └── tsconfig.lib.json
    └── 📁logs
    └── 📁scripts
        └── dev-up.sh
        └── generate-kafka-compose.sh
        └── init-microservice.sh
        └── init-proto.sh
    └── .dockerignore
    └── .env.__projectName__
    └── .gitignore
    └── .prettierignore
    └── .prettierrc
    └── commitlint.config.mjs
    └── eslint.config.mjs
    └── jest.config.ts
    └── LICENSE
    └── nest-cli.json
    └── package-lock.json
    └── package.json
    └── README.md
    └── tsconfig.build.json
    └── tsconfig.json
```


## Informe de auditoría técnica

### Marco de referencia

* **ISO/IEC 25010**: mantenibilidad (modularidad, analizabilidad, modificabilidad, reusabilidad) y portabilidad.
* **ISO/IEC/IEEE 42010**: “principio de separación de intereses” y trazabilidad entre preocupaciones y artefactos.
* **Clean Architecture + DDD + CQRS + Hexagonal**:

  1. Dependencias unidireccionales → *Dominio ← Aplicación ← Infraestructura*.
  2. Lógica de negocio dentro del dominio; controladores sólo orquestan casos de uso.
  3. Persistencia, transporte, frameworks y mapeos quedan fuera del núcleo.

---

## 1 Dominio

| Hallazgo                                                                                                                       | Justificación técnica                                                                         | Severidad |
| ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- | --------- |
| **👍 Entidades, VO y eventos** aislados en `__projectName__/domain`.                                                                    | Cumple el “modelo rico” de DDD y permite test unitarios sin dependencias externas.            | ✔︎         |
| **⚠️ Entidad sin comportamiento** (métodos mutadores ausentes; la lógica reside en `domain/services`).                          | Riesgo de *modelo anémico*: viola “Tell, Don’t Ask”; degrada **modificabilidad** (ISO 25010). | Alta      |
| **⚠️ Interfaz `__ProjectName__Repository` expuesta desde dominio pero implementaciones comentan tipos Prisma** (en fragmentos previos). | Fuga de detalles de infraestructura → quiebra la frontera hexagonal.                          | Media     |
| **❌ Duplicación de `__projectName__.module.ts`** dentro de dominio e infra.                                                            | Contaminación de capa y ambigüedad de dependencia; rompe “High Cohesion, Low Coupling”.       | Alta      |

### Correcciones obligatorias

1. Trasladar invariantes y reglas al propio `__ProjectName__Entity`; mantener servicios de dominio sólo para operaciones multi-agregado.
2. Asegurar que la interfaz de repositorio use **Value Objects** y tipos del dominio, jamás DTO/ORM.
3. Eliminar cualquier referencia a NestJS, Prisma o gRPC dentro de `domain/*`.
4. Un único `__projectName__.domain.module` opcional, exportado sólo para *testing*.

---

## 2 Aplicación

| Hallazgo                                                                                               | Justificación técnica                                                                                                                    | Severidad |
| ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| **👍 Casos de uso en `use-cases/`** con archivos `*.use-case.ts`.                                       | Alineado con CQRS (comandos ↔ queries).                                                                                                  | ✔︎         |
| **⚠️ Carperta `application/services` coexistiendo con `use-cases`**.                                    | Superpone patrones *Service Layer* y *Use-Case* → confunde punto único de orquestación (*Single Responsibility*, ISO 25010-Modularidad). | Media     |
| **⚠️ DTOs aquí se re-usan en controladores**.                                                           | Acopla capa de transporte a la de aplicación; compromete reusabilidad.                                                                   | Media     |
| **❌ Falta segregación clara Command / Query** (ejemplo: `GetAll__ProjectName__s` no usa QueryHandler clásico). | Incumple CQRS, dificulta escalar lectura/escritura de forma independiente.                                                               | Alta      |

### Correcciones obligatorias

1. Eliminar `application/services`; cada comando/consulta debe ser un `@CommandHandler`/`@QueryHandler`.
2. Colocar DTOs en **interfaz** o **infraestructura/transport**, mapearlos a Value Objects dentro del handler.
3. Añadir *Query Bus* + *Command Bus* de NestJS-CQRS con handlers separados.

---

## 3 Infraestructura

| Hallazgo                                                                                                                   | Justificación técnica                                                                      | Severidad |
| -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | --------- |
| **👍 Controladores gRPC en `infraestructure/grpc/adapters`** y repositorios Prisma en `database/`.                          | Cumple “puertos y adaptadores”.                                                            | ✔︎         |
| **⚠️ Código generado gRPC duplicado** (`infraestructure/grpc/generated` **y** `libs/proto/generated`).                      | Duplicación vulnera **analizabilidad** y **modificabilidad**; arriesga des-sincronización. | Media     |
| **⚠️ Controlador importa directamente `__ProjectName__ApplicationService` monolítico** (detectado en fragmentos previos).           | Coloca lógica orquestal fuera de casos de uso; rompe CQRS.                                 | Media     |
| **⚠️ Falta patrón *Outbox* para eventos Kafka** (scripts mencionan Kafka pero no se observa Outbox ni transacción atómica). | Riesgo de inconsistencia eventual; afecta **fiabilidad** (ISO 25010-Confiabilidad).        | Alta      |
| **❌ Módulos duplicados y carpeta `docs/old`** en el path de ejecución.                                                     | Contamina runtime con artefactos obsoletos; degrada **mantenibilidad**.                    | Alta      |

### Correcciones obligatorias

1. Centralizar código generado en `libs/proto/generated`; borrar copias infra.
2. Controladores llaman **únicamente** a sus Command/Query Handlers.
3. Implementar *Transactional Outbox* o *Outbox Pattern* para publicar eventos a Kafka post-commit.
4. Excluir carpetas `docs/*` del path de compilación (TypeScript `exclude`).

---

## 4 Calidad global (ISO/IEC 25010)

| Atributo           | Estado | Evidencia                                           |
| ------------------ | ------ | --------------------------------------------------- |
| **Modularidad**    | ⚠️      | Duplicación de módulos, mezcla DTO ↔ dominio.       |
| **Reusabilidad**   | ⚠️      | DTOs y generated code atados a capas internas.      |
| **Analizabilidad** | ❌      | Código muerto en `docs/old`, estructuras paralelas. |
| **Portabilidad**   | ✔︎      | Aislamiento Docker + K8s manifiestos.               |
| **Mantenibilidad** | ⚠️      | Capas mezcladas dificultan cambios locales.         |

---

## 5 Conclusión fulminante

La base es sólida pero la implementación actual viola principios nucleares de **DDD + CQRS + Hexagonal** y compromete atributos de calidad claves según ISO 25010. **Debe**: reforzar entidades ricas, prohibir fugas de infraestructura, separar comandos/consultas y erradicar duplicaciones.
Corrige eso o el *monstruo anémico* crecerá tanto que ni un `kubectl delete pod --force` lo detendrá. 🦖

Actúa como un arquitecto de software senior especializado en NestJS, DDD, arquitectura hexagonal y CQRS.
Tu tarea es auditar y validar una arquitectura NestJS. Para ello:

Evalúa si el proyecto respeta correctamente los principios de DDD, CQRS y arquitectura hexagonal.

Identifica violaciones como: acoplamiento entre capas, lógica de dominio en controladores, fugas de infraestructura al dominio, etc.


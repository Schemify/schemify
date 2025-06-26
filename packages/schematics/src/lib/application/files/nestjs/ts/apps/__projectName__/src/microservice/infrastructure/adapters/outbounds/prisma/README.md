# 📦 Prisma – Módulo de Persistencia

Este directorio contiene la integración de **Prisma ORM** dentro del microservicio `__ProjectName__`, respetando los principios de **arquitectura hexagonal**, **DDD** y **modularidad escalable** con NestJS.

## 🎯 Propósito de esta capa

- Actuar como **adaptador de infraestructura** para la capa de dominio
- Encapsular la configuración y lifecycle del cliente Prisma
- Proveer una forma centralizada y desacoplada de acceso a la base de datos
- Facilitar la implementación de `Repositories` que cumplan contratos del dominio

## 🧱 Estructura de archivos

```txt
📁 prisma
├── prisma.module.ts             → Módulo NestJS que expone el servicio Prisma
├── prisma.service.ts            → Cliente Prisma extendido y gestionado por NestJS
└── 📁 repositories
    ├── 📁 read/                  → Implementaciones del `__ProjectName__QueryRepository`
    └── 📁 write/                 → Implementaciones del `__ProjectName__CommandRepository`
```

## ⚙️ prisma.service.ts

```ts
@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
```

### ✅ ¿Por qué así?

* Centraliza la conexión y desconexión del cliente Prisma
* Encapsula toda la lógica de inicialización y limpieza
* Permite usar `PrismaService` desde cualquier `@Injectable` de NestJS
* Compatible con `app.enableShutdownHooks()` para cerrar conexiones

> 🔗 [NestJS + Prisma Service recomendado](https://docs.nestjs.com/recipes/prisma#prisma-service)

## 📦 prisma.module.ts

```ts
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}
```

### ✅ ¿Para qué sirve?

* Expone el `PrismaService` como `Provider`
* Permite importar `PrismaModule` desde otros módulos (`InfrastructureModule`, `Repositories`, etc.)
* Desacopla la configuración de Prisma de los módulos de aplicación

## 🧠 Organización de los Repositories

### 📁 `repositories/read/`

Contiene implementaciones específicas para consultas de solo lectura:

* `find-all-__projectName__s.prisma.repository.ts`
* `find-__projectName__-by-id.prisma.repository.ts`
* `find-__projectName__s-by-cursor.prisma.repository.ts`

Cada clase implementa `__ProjectName__QueryRepository`, y solo los métodos requeridos para ese caso de uso (seguimos **CQRS**).

### 📁 `repositories/write/`

Contiene implementaciones de escritura:

* `create-__projectName__.prisma.repository.ts`
* `update-__projectName__.prisma.repository.ts`
* `delete-__projectName__.prisma.repository.ts`

Estas clases implementan `__ProjectName__CommandRepository`.

## ✅ ¿Por qué dividir en read/write?

Seguimos el patrón **CQRS (Command Query Responsibility Segregation)**:
Separar lectura y escritura permite desacoplar responsabilidades, optimizar queries, y escalar independientemente.

> 🔗 [CQRS en NestJS – Documentación oficial](https://docs.nestjs.com/recipes/cqrs)

## 🧪 ¿Dónde se usan estos repositorios?

En la capa de aplicación (commands y queries):

```ts
@QueryHandler(GetAll__ProjectName__sQuery)
export class GetAll__ProjectName__sHandler {
  constructor(
    @Inject('__ProjectName__QueryRepository')
    private readonly repository: __ProjectName__QueryRepository
  ) {}
}
```

## 💡 Buenas prácticas aplicadas

| Principio                         | Cómo se respeta                                          |
| --------------------------------- | -------------------------------------------------------- |
| 🧱 SRP (Single Responsibility)     | PrismaService solo conecta a DB                          |
| 🧩 DIP (Inversión de dependencias) | Repositorios son inyectados por tokens, no por clase     |
| 🔁 Reusabilidad                    | `PrismaModule` se importa desde cualquier feature module |
| 🔐 Encapsulamiento                 | Prisma nunca se expone directamente a dominio o handlers |
| 🧼 Cohesión                        | Estructura clara por tipo (read/write) y por caso de uso |

## 📎 Recursos recomendados

* 📘 Prisma en NestJS (Nest docs):
  [https://docs.nestjs.com/recipes/prisma](https://docs.nestjs.com/recipes/prisma)

* 📘 CQRS en NestJS:
  [https://docs.nestjs.com/recipes/cqrs](https://docs.nestjs.com/recipes/cqrs)

* 📘 Prisma Client lifecycle (onModuleInit):
  [https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client](https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client)

## ✅ ¿Dónde comenzar?

1. Configura `prisma.service.ts`
2. Registra el módulo en `InfrastructureModule`
3. Implementa tus `Read` y `Write` repositories por separado
4. Usa `@Inject('__ProjectName__QueryRepository')` desde queries
5. Usa `@Inject('__ProjectName__CommandRepository')` desde commands

---

> 🔐 *"Infraestructura puede cambiar, el dominio no."*
> Por eso esta capa está diseñada para adaptarse sin romper el resto del sistema.
# 🧠 Capa de Dominio - Microservicio `Micromicro`

## 📌 Propósito de la capa de dominio

La capa de dominio representa **el corazón del negocio**: encapsula **las reglas, entidades, comportamientos y eventos clave** que modelan el problema que este microservicio resuelve.

### 🎯 Su objetivo principal:
- Representar el **modelo del negocio** (no de la base de datos)
- Garantizar que el sistema **solo pueda operar con datos válidos**
- Ser **independiente de frameworks** y **no depender de infraestructura**
- Servir como contrato central para el resto de las capas

## ⚙️ Principios y prácticas aplicadas

### ✅ Diseño basado en DDD (Domain-Driven Design)
- Modela los conceptos del negocio mediante entidades y value objects
- Separa los **eventos del dominio**, reglas, validaciones y contratos

### ✅ Arquitectura limpia / hexagonal
- La capa **no conoce** ni depende de DB, HTTP, controladores o servicios externos
- Toda lógica técnica (persistencia, red, etc.) se inyecta desde fuera

### ✅ CQRS
- La lógica de **lectura y escritura se separa** en dos interfaces:
  - `MicromicroQueryRepository`
  - `MicromicroCommandRepository`

## 🧱 Estructura de carpetas

```txt
📁 domain
├── 📁 entities                    → Entidades del dominio (Aggregate Roots)
│   └── micromicro.entity.ts         → Entidad raíz que contiene reglas, estado y eventos
│
├── 📁 value-objects              → Objetos de valor (validan datos y reglas simples)
│   ├── name.value-object.ts      → NameValueObject (mín/max, obligatorio)
│   └── description.value-object.ts → DescriptionValueObject (máx 300)
│
├── 📁 events                     → Eventos de dominio (emitidos desde entidades)
│   ├── micromicro-created.event.ts
│   ├── micromicro-renamed.event.ts
│   └── micromicro-description-updated.event.ts
│
├── 📁 repositories               → Contratos de acceso a persistencia
│   ├── micromicro.read-repository.ts
│   └── micromicro.write-repository.ts
│
├── 📁 interfaces                 → Tipos reutilizables entre archivos del dominio
│   └── micromicro.domain.interface.ts
```

## 🧠 Qué hace cada componente

### 🔹 `entities/micromicro.entity.ts`
- Es la **entidad raíz** del agregado `Micromicro`
- Controla el estado y la validez del agregado
- Expone métodos:
  - `create()` → para instanciar uno nuevo (con eventos)
  - `update()` → para modificar datos (con handlers internos)
  - `fromPrimitives()` / `toPrimitives()` → para reconstrucción y persistencia

### 🔹 `value-objects/*.ts`
- Validan y encapsulan datos atómicos
- Garantizan que los datos son **válidos desde su nacimiento**
- Evitan repetir lógica de validación en otros lados

### 🔹 `events/*.ts`
- Representan **hechos importantes del negocio**
- Emitidos mediante `this.apply(event)` desde el agregado
- Son utilizados por listeners, proyecciones o integraciones (ej: Kafka, logs, etc.)

### 🔹 `repositories/*.ts`
- Son **interfaces** para leer/escribir entidades del dominio
- `ReadRepository` → para queries
- `WriteRepository` → para commands
- Se implementan en la **capa de infraestructura**, fuera del dominio

### 🔹 `interfaces/*.ts`
- Tipos compartidos entre los componentes de dominio
- `MicromicroUpdateProps`, `MicromicroPrimitives`, `MicromicroProps`, etc.
- Evita repetir estructuras y mantiene tipado fuerte

## 📚 Reglas de negocio implementadas

### En `NameValueObject`
- Nombre es obligatorio
- Debe tener entre 3 y 50 caracteres

### En `DescriptionValueObject`
- Descripción es opcional
- Si existe, no debe superar 300 caracteres

### En `MicromicroEntity`
- Solo se actualizan campos si cambiaron
- Se emiten eventos `Renamed` o `DescriptionUpdated` según corresponda
- Se encapsula el `update()` en un mapa de handlers reutilizables

## 🧭 ¿Dónde se usa esta capa?

| Capa                | ¿Cómo usa el dominio?                                                   |
| ------------------- | ----------------------------------------------------------------------- |
| ✅ Application Layer | Instancia `MicromicroEntity`, llama `create()`, `update()` |
| ✅ Repositories      | Usan `fromPrimitives()` y `toPrimitives()` para persistir               |
| ✅ Event Handlers    | Escuchan eventos del dominio emitidos desde entidades                   |
| ❌ Infraestructura   | NO debe modificar entidades directamente                                |
| ❌ Controladores     | NO interactúan con el dominio directamente                              |

---

## 🔐 Límites de esta capa

### ❗ Lo que **sí** debe contener
- Lógica de negocio
- Validaciones del dominio
- Comportamiento de entidades
- Eventos de dominio

### 🚫 Lo que **NO** debe contener
- Acceso a base de datos
- Llamadas HTTP o a otros servicios
- Decoradores de NestJS (como `@Injectable`, `@Controller`, etc.)
- DTOs o clases específicas de la infraestructura

## 🧩 Ruta de dependencias internas

```txt
entities ──► value-objects
entities ──► interfaces
entities ──► events

repositories ──► entities

interfaces ──► value-objects (para describir `MicromicroProps`)
```


## ✅ Consejos para trabajar con esta capa

1. 💡 **Piensa en el negocio, no en la tecnología**
   Define reglas y comportamientos como lo haría un experto del negocio.

2. 🧪 **Valida todo desde el Value Object**
   Si un dato no es válido, **ni siquiera lo crees**.

3. 🧱 **Mantén el dominio aislado**
   Nunca uses decoradores de NestJS aquí. Nada de DB ni HTTP.

4. ♻️ **Reutiliza estructuras tipadas (`interfaces/`)**
   No repitas tipos `{ name?: string }` por todos lados.

5. 🧼 **Una entidad = un propósito**
   No metas más de una entidad raíz en el mismo microservicio.

## 🚀 ¿Por dónde comenzar?

1. 🛠️ Crea primero tus `ValueObjects` con reglas del negocio
2. 🎯 Luego modela tu `Entity` con esos VOs
3. ✍️ Define `create`, `update` y eventos necesarios
4. 📤 Exporta con `toPrimitives()` y reconstruye con `fromPrimitives()`
5. 📦 Usa interfaces (`.interface.ts`) para compartir contratos

---

> Si el dominio está bien modelado, **todo lo demás se vuelve mucho más simple**.

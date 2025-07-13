/**
 * 📌 gRPC Query Controllers - CQRS (Queries)
 * -----------------------------------------------------------------------------
 * Este archivo agrupa todos los controladores gRPC responsables de operaciones
 * de lectura (`Query`) para el agregado `__project_name_camel__`.
 *
 * Cada controlador maneja un único endpoint gRPC del servicio definido en el `.proto`.
 * Se usa en el `__project_name_pascal__Module` para registrar los controladores de lectura gRPC.
 *
 * ❗ Importante:
 * - No se debe usar `implements __project_name_camel__ServiceController` ya que estos controladores
 *   sólo implementan parcialmente los métodos gRPC.
 * - NestJS los enlaza mediante el decorador `@__project_name_camel__ServiceControllerMethods()`.
 *
 * Uso típico:
 *
 * ```ts
 * import { GrpcQueryControllers } from './controllers/grpc/Query'
 *
 * @Module({
 *   controllers: [...GrpcQueryControllers]
 * })
 * export class __project_name_pascal__Module {}
 * ```
 */

// 🧩 Controladores individuales (por caso de uso)
import { GetAll__project_name_camel__GrpcController } from './get-all-__project_name_kebab__/get-all-__project_name_kebab__.grpc.controller'
import { Get__project_name_camel__ByIdGrpcController } from './get-__project_name_kebab__-by-id/get-__project_name_kebab__-by-id.grpc.controller'
import { Get__project_name_camel__ByCursorGrpcController } from './get-__project_name_kebab__-by-cursor/get-__project_name_kebab__-by-cursor.grpc.controller'

/**
 * 📦 Array de controladores gRPC para Queries (Lectura)
 */
export const GrpcQueryControllers = [
  GetAll__project_name_camel__GrpcController,
  Get__project_name_camel__ByIdGrpcController,
  Get__project_name_camel__ByCursorGrpcController
]

// 📤 Exportación individual si se necesita
export * from './get-all-__project_name_kebab__/get-all-__project_name_kebab__.grpc.controller'
export * from './get-__project_name_kebab__-by-id/get-__project_name_kebab__-by-id.grpc.controller'
export * from './get-__project_name_kebab__-by-cursor/get-__project_name_kebab__-by-cursor.grpc.controller'

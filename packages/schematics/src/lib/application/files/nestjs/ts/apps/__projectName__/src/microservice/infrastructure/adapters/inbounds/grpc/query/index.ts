/**
 * 📌 gRPC Query Controllers - CQRS (Queries)
 * -----------------------------------------------------------------------------
 * Este archivo agrupa todos los controladores gRPC responsables de operaciones
 * de lectura (`Query`) para el agregado `__ProjectName__`.
 *
 * Cada controlador maneja un único endpoint gRPC del servicio definido en el `.proto`.
 * Se usa en el `__ProjectName__Module` para registrar los controladores de lectura gRPC.
 *
 * ❗ Importante:
 * - No se debe usar `implements __ProjectName__ServiceController` ya que estos controladores
 *   sólo implementan parcialmente los métodos gRPC.
 * - NestJS los enlaza mediante el decorador `@__ProjectName__ServiceControllerMethods()`.
 *
 * Uso típico:
 *
 * ```ts
 * import { GrpcQueryControllers } from './controllers/grpc/Query'
 *
 * @Module({
 *   controllers: [...GrpcQueryControllers]
 * })
 * export class __ProjectName__Module {}
 * ```
 */

// 🧩 Controladores individuales (por caso de uso)
import { GetAll__ProjectName__sGrpcController } from './get-all-__projectName__.grpc.controller'
import { Get__ProjectName__ByIdGrpcController } from './get-__projectName__-by-id.grpc.controller'
import { Get__ProjectName__sByCursorGrpcController } from './get-__projectName__-by-cursor.grpc.controller'

/**
 * 📦 Array de controladores gRPC para Queries (Lectura)
 */
export const GrpcQueryControllers = [
  GetAll__ProjectName__sGrpcController,
  Get__ProjectName__ByIdGrpcController,
  Get__ProjectName__sByCursorGrpcController
]

// 📤 Exportación individual si se necesita
export * from './get-all-__projectName__.grpc.controller'
export * from './get-__projectName__-by-id.grpc.controller'
export * from './get-__projectName__-by-cursor.grpc.controller'

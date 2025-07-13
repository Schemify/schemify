/**
 * 📌 gRPC Query Controllers - CQRS (Queries)
 * -----------------------------------------------------------------------------
 * Este archivo agrupa todos los controladores gRPC responsables de operaciones
 * de lectura (`Query`) para el agregado `MicroserviceName`.
 *
 * Cada controlador maneja un único endpoint gRPC del servicio definido en el `.proto`.
 * Se usa en el `MicroserviceNameModule` para registrar los controladores de lectura gRPC.
 *
 * ❗ Importante:
 * - No se debe usar `implements MicroserviceNameServiceController` ya que estos controladores
 *   sólo implementan parcialmente los métodos gRPC.
 * - NestJS los enlaza mediante el decorador `@MicroserviceNameServiceControllerMethods()`.
 *
 * Uso típico:
 *
 * ```ts
 * import { GrpcQueryControllers } from './controllers/grpc/Query'
 *
 * @Module({
 *   controllers: [...GrpcQueryControllers]
 * })
 * export class MicroserviceNameModule {}
 * ```
 */

// 🧩 Controladores individuales (por caso de uso)
import { GetAllMicroserviceNameGrpcController } from './get-all-__project_name_kebab__/get-all-microserviceName.grpc.controller'
import { GetMicroserviceNameByIdGrpcController } from './get-microserviceName-by-id/get-microserviceName-by-id.grpc.controller'
import { GetMicroserviceNameByCursorGrpcController } from './get-microserviceName-by-cursor/get-microserviceName-by-cursor.grpc.controller'

/**
 * 📦 Array de controladores gRPC para Queries (Lectura)
 */
export const GrpcQueryControllers = [
  GetAllMicroserviceNameGrpcController,
  GetMicroserviceNameByIdGrpcController,
  GetMicroserviceNameByCursorGrpcController
]

// 📤 Exportación individual si se necesita
export * from './get-all-__project_name_kebab__/get-all-microserviceName.grpc.controller'
export * from './get-microserviceName-by-id/get-microserviceName-by-id.grpc.controller'
export * from './get-microserviceName-by-cursor/get-microserviceName-by-cursor.grpc.controller'

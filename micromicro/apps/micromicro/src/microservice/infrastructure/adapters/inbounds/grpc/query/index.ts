/**
 * 📌 gRPC Query Controllers - CQRS (Queries)
 * -----------------------------------------------------------------------------
 * Este archivo agrupa todos los controladores gRPC responsables de operaciones
 * de lectura (`Query`) para el agregado `Micromicro`.
 *
 * Cada controlador maneja un único endpoint gRPC del servicio definido en el `.proto`.
 * Se usa en el `MicromicroModule` para registrar los controladores de lectura gRPC.
 *
 * ❗ Importante:
 * - No se debe usar `implements MicromicroServiceController` ya que estos controladores
 *   sólo implementan parcialmente los métodos gRPC.
 * - NestJS los enlaza mediante el decorador `@MicromicroServiceControllerMethods()`.
 *
 * Uso típico:
 *
 * ```ts
 * import { GrpcQueryControllers } from './controllers/grpc/Query'
 *
 * @Module({
 *   controllers: [...GrpcQueryControllers]
 * })
 * export class MicromicroModule {}
 * ```
 */

// 🧩 Controladores individuales (por caso de uso)
import { GetAllMicromicroGrpcController } from './get-all/get-all-micromicro.grpc.controller'
import { GetMicromicroByIdGrpcController } from './get-micromicro-by-id/get-micromicro-by-id.grpc.controller'
import { GetMicromicroByCursorGrpcController } from './get-micromicro-by-cursor/get-micromicro-by-cursor.grpc.controller'

/**
 * 📦 Array de controladores gRPC para Queries (Lectura)
 */
export const GrpcQueryControllers = [
  GetAllMicromicroGrpcController,
  GetMicromicroByIdGrpcController,
  GetMicromicroByCursorGrpcController
]

// 📤 Exportación individual si se necesita
export * from './get-all/get-all-micromicro.grpc.controller'
export * from './get-micromicro-by-id/get-micromicro-by-id.grpc.controller'
export * from './get-micromicro-by-cursor/get-micromicro-by-cursor.grpc.controller'

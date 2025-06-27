/**
 * 📌 gRPC Command Controllers - CQRS (Commands)
 * -----------------------------------------------------------------------------
 * Este archivo agrupa todos los controladores gRPC responsables de operaciones
 * de escritura (`Commands`) para el agregado `Micromicro`.
 *
 * Cada controlador implementa un único RPC del servicio definido en el `.proto`,
 * correspondiente a una acción de mutación (create, update, delete).
 *
 * ❗ Importante:
 * - Estos controladores NO implementan directamente `MicromicroServiceController`
 * - NestJS los vincula mediante reflexión con el decorador
 *   `@MicromicroServiceControllerMethods()`
 * - Se usan en el `MicromicroModule` para ser registrados como `controllers`
 *
 * 📦 Exportación centralizada para facilitar su inclusión:
 *
 * ```ts
 * import { GrpcCommandControllers } from './controllers/grpc/Command'
 *
 * @Module({
 *   controllers: [...GrpcCommandControllers]
 * })
 * export class MicromicroModule {}
 * ```
 */

// 🧩 Controladores individuales (por comando)
import { CreateMicromicroGrpcController } from './create-micromicro/create-micromicro.grpc.controller'
import { UpdateMicromicroGrpcController } from './update-micromicro/update-micromicro.grpc.controller'
import { DeleteMicromicroGrpcController } from './delete-micromicro/delete-micromicro.grpc.controller'

/**
 * 📦 Conjunto de controladores gRPC de escritura para CQRS Commands
 */
export const GrpcCommandControllers = [
  CreateMicromicroGrpcController,
  UpdateMicromicroGrpcController,
  DeleteMicromicroGrpcController
]

// 📤 Exportación individual si se necesita
export * from './create-micromicro/create-micromicro.grpc.controller'
export * from './update-micromicro/update-micromicro.grpc.controller'
export * from './delete-micromicro/delete-micromicro.grpc.controller'

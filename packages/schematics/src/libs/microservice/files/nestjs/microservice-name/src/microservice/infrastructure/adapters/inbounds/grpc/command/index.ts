/**
 * 📌 gRPC Command Controllers - CQRS (Commands)
 * -----------------------------------------------------------------------------
 * Este archivo agrupa todos los controladores gRPC responsables de operaciones
 * de escritura (`Commands`) para el agregado `MicroserviceName`.
 *
 * Cada controlador implementa un único RPC del servicio definido en el `.proto`,
 * correspondiente a una acción de mutación (create, update, delete).
 *
 * ❗ Importante:
 * - Estos controladores NO implementan directamente `MicroserviceNameServiceController`
 * - NestJS los vincula mediante reflexión con el decorador
 *   `@MicroserviceNameServiceControllerMethods()`
 * - Se usan en el `MicroserviceNameModule` para ser registrados como `controllers`
 *
 * 📦 Exportación centralizada para facilitar su inclusión:
 *
 * ```ts
 * import { GrpcCommandControllers } from './controllers/grpc/Command'
 *
 * @Module({
 *   controllers: [...GrpcCommandControllers]
 * })
 * export class MicroserviceNameModule {}
 * ```
 */

// 🧩 Controladores individuales (por comando)
import { CreateMicroserviceNameGrpcController } from './create-microserviceName/create-microserviceName.grpc.controller'
import { UpdateMicroserviceNameGrpcController } from './update-microserviceName/update-microserviceName.grpc.controller'
import { DeleteMicroserviceNameGrpcController } from './delete-microserviceName/delete-microserviceName.grpc.controller'

/**
 * 📦 Conjunto de controladores gRPC de escritura para CQRS Commands
 */
export const GrpcCommandControllers = [
  CreateMicroserviceNameGrpcController,
  UpdateMicroserviceNameGrpcController,
  DeleteMicroserviceNameGrpcController
]

// 📤 Exportación individual si se necesita
export * from './create-microserviceName/create-microserviceName.grpc.controller'
export * from './update-microserviceName/update-microserviceName.grpc.controller'
export * from './delete-microserviceName/delete-microserviceName.grpc.controller'

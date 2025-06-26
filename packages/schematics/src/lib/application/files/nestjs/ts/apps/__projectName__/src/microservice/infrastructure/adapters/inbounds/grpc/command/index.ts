/**
 * 📌 gRPC Command Controllers - CQRS (Commands)
 * -----------------------------------------------------------------------------
 * Este archivo agrupa todos los controladores gRPC responsables de operaciones
 * de escritura (`Commands`) para el agregado `__ProjectName__`.
 *
 * Cada controlador implementa un único RPC del servicio definido en el `.proto`,
 * correspondiente a una acción de mutación (create, update, delete).
 *
 * ❗ Importante:
 * - Estos controladores NO implementan directamente `__ProjectName__ServiceController`
 * - NestJS los vincula mediante reflexión con el decorador
 *   `@__ProjectName__ServiceControllerMethods()`
 * - Se usan en el `__ProjectName__Module` para ser registrados como `controllers`
 *
 * 📦 Exportación centralizada para facilitar su inclusión:
 *
 * ```ts
 * import { GrpcCommandControllers } from './controllers/grpc/Command'
 *
 * @Module({
 *   controllers: [...GrpcCommandControllers]
 * })
 * export class __ProjectName__Module {}
 * ```
 */

// 🧩 Controladores individuales (por comando)
import { Create__ProjectName__GrpcController } from './create-__projectName__.grpc.controller'
import { Update__ProjectName__GrpcController } from './update-__projectName__.grpc.controller'
import { Delete__ProjectName__GrpcController } from './delete-__projectName__.grpc.controller'

/**
 * 📦 Conjunto de controladores gRPC de escritura para CQRS Commands
 */
export const GrpcCommandControllers = [
  Create__ProjectName__GrpcController,
  Update__ProjectName__GrpcController,
  Delete__ProjectName__GrpcController
]

// 📤 Exportación individual si se necesita
export * from './create-__projectName__.grpc.controller'
export * from './update-__projectName__.grpc.controller'
export * from './delete-__projectName__.grpc.controller'

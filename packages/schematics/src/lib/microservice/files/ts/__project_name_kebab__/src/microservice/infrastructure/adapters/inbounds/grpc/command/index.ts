/**
 * 📌 gRPC Command Controllers - CQRS (Commands)
 * -----------------------------------------------------------------------------
 * Este archivo agrupa todos los controladores gRPC responsables de operaciones
 * de escritura (`Commands`) para el agregado `__project_name_pascal__`.
 *
 * Cada controlador implementa un único RPC del servicio definido en el `.proto`,
 * correspondiente a una acción de mutación (create, update, delete).
 *
 * ❗ Importante:
 * - Estos controladores NO implementan directamente `__project_name_pascal__ServiceController`
 * - NestJS los vincula mediante reflexión con el decorador
 *   `@__project_name_pascal__ServiceControllerMethods()`
 * - Se usan en el `__project_name_pascal__Module` para ser registrados como `controllers`
 *
 * 📦 Exportación centralizada para facilitar su inclusión:
 *
 * ```ts
 * import { GrpcCommandControllers } from './controllers/grpc/Command'
 *
 * @Module({
 *   controllers: [...GrpcCommandControllers]
 * })
 * export class __project_name_pascal__Module {}
 * ```
 */

// 🧩 Controladores individuales (por comando)
import { Create__project_name_pascal__GrpcController } from './create-__project_name_camel__/create-__project_name_camel__.grpc.controller'
import { Update__project_name_pascal__GrpcController } from './update-__project_name_camel__/update-__project_name_camel__.grpc.controller'
import { Delete__project_name_pascal__GrpcController } from './delete-__project_name_camel__/delete-__project_name_camel__.grpc.controller'

/**
 * 📦 Conjunto de controladores gRPC de escritura para CQRS Commands
 */
export const GrpcCommandControllers = [
  Create__project_name_pascal__GrpcController,
  Update__project_name_pascal__GrpcController,
  Delete__project_name_pascal__GrpcController
]

// 📤 Exportación individual si se necesita
export * from './create-__project_name_camel__/create-__project_name_camel__.grpc.controller'
export * from './update-__project_name_camel__/update-__project_name_camel__.grpc.controller'
export * from './delete-__project_name_camel__/delete-__project_name_camel__.grpc.controller'

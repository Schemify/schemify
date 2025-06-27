/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
/**
 * DeleteMicromicroGrpcController
 * -----------------------------------------------------------------------------
 * Controlador gRPC que maneja la operación `deleteMicromicro()` del servicio `MicromicroService`.
 *
 * Se encarga de:
 * ✅ Recibir el ID del recurso a eliminar desde el DTO Protobuf
 * ✅ Enviar el comando `DeleteMicromicroCommand` mediante el `CommandBus`
 * ✅ Retornar una respuesta vacía (`MicromicroEmpty`) al micromicro gRPC
 *
 * Esta clase forma parte de la capa **de infraestructura** y solo actúa como puente
 * entre el transporte (gRPC) y la capa de aplicación.
 */

import { Controller } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { micromicro } from '@proto'

import { DeleteMicromicroCommand } from '@micromicro/microservice/application/ports/inbounds/commands'

@Controller()
export class DeleteMicromicroGrpcController {
  constructor(private readonly commandBus: CommandBus) {}

  /**
   * ⚠️ NOTA IMPORTANTE:
   * Esta clase NO implementa la interfaz completa `MicromicroServiceController`
   * ya que sólo implementa el RPC `deleteMicromicro`.
   * NestJS vincula el método mediante reflexión con
   * `@MicromicroServiceControllerMethods()`.
   */

  /**
   * Maneja la llamada RPC `deleteMicromicro`.
   *
   * Flujo:
   * 1. Recibe un DTO con el ID del recurso
   * 2. Ejecuta `DeleteMicromicroCommand` por medio del `CommandBus`
   * 3. No devuelve entidad ni DTO; sólo `{}` como `MicromicroEmpty`
   *
   * @param request DTO gRPC con el ID del recurso
   * @returns Objeto vacío `MicromicroEmpty`
   */

  @GrpcMethod('MicromicroService', 'deleteMicromicro')
  async deleteMicromicro(
    request: micromicro.GetMicromicroByIdDto
  ): Promise<micromicro.MicromicroEmpty> {
    const command = new DeleteMicromicroCommand(request.id)
    await this.commandBus.execute(command)

    return {}
  }
}

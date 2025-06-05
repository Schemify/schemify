/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
/**
 * Delete__ProjectName__GrpcController
 * -----------------------------------------------------------------------------
 * Controlador gRPC que maneja la operación `delete__ProjectName__()` del servicio `__ProjectName__Service`.
 *
 * Se encarga de:
 * ✅ Recibir el ID del recurso a eliminar desde el DTO Protobuf
 * ✅ Enviar el comando `Delete__ProjectName__Command` mediante el `CommandBus`
 * ✅ Retornar una respuesta vacía (`__ProjectName__Empty`) al cliente gRPC
 *
 * Esta clase forma parte de la capa **de infraestructura** y solo actúa como puente
 * entre el transporte (gRPC) y la capa de aplicación.
 */

import { Controller } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { __projectNameCamel__ } from '@proto'

import { Delete__ProjectName__Command } from '@__projectName__/microservice/application/ports/inbounds/commands'


@Controller()
export class Delete__ProjectName__GrpcController {
  constructor(private readonly commandBus: CommandBus) {}

  /**
   * ⚠️ NOTA IMPORTANTE:
   * Esta clase NO implementa la interfaz completa `__ProjectName__ServiceController`
   * ya que sólo implementa el RPC `delete__ProjectName__`.
   * NestJS vincula el método mediante reflexión con
   * `@__ProjectName__ServiceControllerMethods()`.
   */

  /**
   * Maneja la llamada RPC `delete__ProjectName__`.
   *
   * Flujo:
   * 1. Recibe un DTO con el ID del recurso
   * 2. Ejecuta `Delete__ProjectName__Command` por medio del `CommandBus`
   * 3. No devuelve entidad ni DTO; sólo `{}` como `__ProjectName__Empty`
   *
   * @param request DTO gRPC con el ID del recurso
   * @returns Objeto vacío `__ProjectName__Empty`
   */

  @GrpcMethod(__projectNameCamel__.EXAMPLE_SERVICE_NAME, 'delete__ProjectName__')
  async delete__ProjectName__(
    request: __projectNameCamel__.Get__ProjectName__ByIdDto
  ): Promise<__projectNameCamel__.__ProjectName__Empty> {
    const command = new Delete__ProjectName__Command(request.id)
    await this.commandBus.execute(command)

    return {}
  }
}

/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
/**
 * Delete__project_name_pascal__GrpcController
 * -----------------------------------------------------------------------------
 * Controlador gRPC que maneja la operación `delete__project_name_pascal__()` del servicio `__project_name_pascal__Service`.
 *
 * Se encarga de:
 * ✅ Recibir el ID del recurso a eliminar desde el DTO Protobuf
 * ✅ Enviar el comando `Delete__project_name_pascal__Command` mediante el `CommandBus`
 * ✅ Retornar una respuesta vacía (`__project_name_pascal__Empty`) al cliente gRPC
 *
 * Esta clase forma parte de la capa **de infraestructura** y solo actúa como puente
 * entre el transporte (gRPC) y la capa de aplicación.
 */

import { Controller } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { __project_name_kebab__ } from '@proto'

import { Delete__project_name_pascal__Command } from '@__project_name_kebab__/microservice/application/ports/inbounds/commands'

@Controller()
export class Delete__project_name_pascal__GrpcController {
  constructor(private readonly commandBus: CommandBus) {}

  /**
   * ⚠️ NOTA IMPORTANTE:
   * Esta clase NO implementa la interfaz completa `__project_name_pascal__ServiceController`
   * ya que sólo implementa el RPC `delete__project_name_pascal__`.
   * NestJS vincula el método mediante reflexión con
   * `@__project_name_pascal__ServiceControllerMethods()`.
   */

  /**
   * Maneja la llamada RPC `delete__project_name_pascal__`.
   *
   * Flujo:
   * 1. Recibe un DTO con el ID del recurso
   * 2. Ejecuta `Delete__project_name_pascal__Command` por medio del `CommandBus`
   * 3. No devuelve entidad ni DTO; sólo `{}` como `__project_name_pascal__Empty`
   *
   * @param request DTO gRPC con el ID del recurso
   * @returns Objeto vacío `__project_name_pascal__Empty`
   */

  @GrpcMethod('ClientesService', 'deleteClientes')
  async deleteClientes(
    request: __project_name_kebab__.Get__project_name_pascal__ByIdDto
  ): Promise<__project_name_kebab__.__project_name_pascal__Empty> {
    const command = new Delete__project_name_pascal__Command(request.id)
    await this.commandBus.execute(command)

    return {}
  }
}

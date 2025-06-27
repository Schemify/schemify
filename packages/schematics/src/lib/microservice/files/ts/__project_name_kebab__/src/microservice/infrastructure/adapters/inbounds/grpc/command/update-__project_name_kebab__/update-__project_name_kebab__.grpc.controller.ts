/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
/**
 * Update__project_name_pascal__GrpcController
 * -----------------------------------------------------------------------------
 * Controlador gRPC que maneja la operación `update__project_name_pascal__()` del servicio `__project_name_pascal__Service`.
 *
 * Se encarga de:
 * ✅ Recibir el `id` y nuevos valores de actualización desde el DTO Protobuf
 * ✅ Ejecutar el caso de uso `Update__project_name_pascal__Command` mediante el `CommandBus`
 * ✅ Convertir la entidad resultante en un objeto `__project_name_camel__.__project_name_pascal__` (Protobuf)
 *
 * Esta clase forma parte de la **capa de infraestructura**, y su función es
 * traducir el transporte en ejecución de lógica de aplicación.
 */

import { Controller } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { __project_name_camel__ } from '@proto'

import { Update__project_name_pascal__Command } from '@__project_name_camel__/microservice/application/ports/inbounds/commands'
import { __project_name_pascal__Mapper } from '@__project_name_camel__/microservice/infrastructure/mappers/__project_name_camel__.mapper'

@Controller()
export class Update__project_name_pascal__GrpcController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: __project_name_pascal__Mapper
  ) {}

  /**
   * ⚠️ NOTA IMPORTANTE:
   * Esta clase NO implementa la interfaz completa `__project_name_pascal__ServiceController`
   * ya que sólo implementa el RPC `update__project_name_pascal__`.
   * NestJS vincula el método usando reflexión con
   * `@__project_name_pascal__ServiceControllerMethods()`.
   */

  /**
   * Maneja la llamada RPC `update__project_name_pascal__`.
   *
   * Flujo:
   * 1. Recibe un DTO con el `id` y campos a actualizar
   * 2. Convierte los datos a objetos de valor mediante `__project_name_pascal__Mapper`
   * 3. Ejecuta el comando `Update__project_name_pascal__Command`
   * 4. El handler aplica cambios y retorna la entidad modificada
   * 5. Se transforma a Protobuf y se retorna al __project_name_camel__ gRPC
   *
   * @param request DTO gRPC con los datos actualizables (`Update__project_name_pascal__Dto`)
   * @returns __project_name_camel__.__project_name_pascal__` (respuesta actualizada)
   */

  @GrpcMethod('__project_name_pascal__Service', 'update__project_name_pascal__')
  async update__project_name_pascal__(
    request: __project_name_camel__.Update__project_name_pascal__Dto
  ): Promise<__project_name_camel__.__project_name_pascal__> {
    if (!request.__project_name_camel__) {
      throw new Error('Falta el objeto __project_name_camel__ en el payload')
    }

    const props = this.mapper.protoToProps(request.__project_name_camel__)

    const command = new Update__project_name_pascal__Command(
      request.id,
      props.name?.value,
      props.description?.value
    )

    const entity = await this.commandBus.execute(command)

    return this.mapper.entityToProto(entity)
  }
}

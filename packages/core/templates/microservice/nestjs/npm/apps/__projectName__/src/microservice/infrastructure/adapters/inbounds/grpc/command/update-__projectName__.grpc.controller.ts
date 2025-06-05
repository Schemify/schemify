/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
/**
 * Update__ProjectName__GrpcController
 * -----------------------------------------------------------------------------
 * Controlador gRPC que maneja la operación `update__ProjectName__()` del servicio `__ProjectName__Service`.
 *
 * Se encarga de:
 * ✅ Recibir el `id` y nuevos valores de actualización desde el DTO Protobuf
 * ✅ Ejecutar el caso de uso `Update__ProjectName__Command` mediante el `CommandBus`
 * ✅ Convertir la entidad resultante en un objeto `__projectName__.__ProjectName__` (Protobuf)
 *
 * Esta clase forma parte de la **capa de infraestructura**, y su función es
 * traducir el transporte en ejecución de lógica de aplicación.
 */

import { Controller } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { __projectNameCamel__ } from '@proto'

import { Update__ProjectName__Command } from '@__projectName__/microservice/application/ports/inbounds/commands'
import { __ProjectName__Mapper } from '@__projectName__/microservice/infrastructure/mappers/__projectName__.mapper'

@Controller()
export class Update__ProjectName__GrpcController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: __ProjectName__Mapper
  ) {}

  /**
   * ⚠️ NOTA IMPORTANTE:
   * Esta clase NO implementa la interfaz completa `__ProjectName__ServiceController`
   * ya que sólo implementa el RPC `update__ProjectName__`.
   * NestJS vincula el método usando reflexión con
   * `@__ProjectName__ServiceControllerMethods()`.
   */

  /**
   * Maneja la llamada RPC `update__ProjectName__`.
   *
   * Flujo:
   * 1. Recibe un DTO con el `id` y campos a actualizar
   * 2. Convierte los datos a objetos de valor mediante `__ProjectName__Mapper`
   * 3. Ejecuta el comando `Update__ProjectName__Command`
   * 4. El handler aplica cambios y retorna la entidad modificada
   * 5. Se transforma a Protobuf y se retorna al cliente gRPC
   *
   * @param request DTO gRPC con los datos actualizables (`Update__ProjectName__Dto`)
   * @returns __projectNameCamel__.__ProjectName__` (respuesta actualizada)
   */

  @GrpcMethod(__projectNameCamel__.EXAMPLE_SERVICE_NAME, 'update__ProjectName__')
  async update__ProjectName__(
    request: __projectNameCamel__.Update__ProjectName__Dto
  ): Promise<__projectNameCamel__.__ProjectName__> {
    if (!request.__projectNameCamel__) {
      throw new Error('Falta el objeto __projectNameCamel__ en el payload')
    }

    const props = this.mapper.protoToProps(request.__projectNameCamel__)

    const command = new Update__ProjectName__Command(
      request.id,
      props.name?.value,
      props.description?.value
    )

    const entity = await this.commandBus.execute(command)

    return this.mapper.entityToProto(entity)
  }
}

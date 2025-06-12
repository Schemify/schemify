/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
/**
 * Create__ProjectName__GrpcController
 * -----------------------------------------------------------------------------
 * Controlador gRPC que maneja la operación `create__ProjectName__()` del servicio `__ProjectName__Service`.
 *
 * Se encarga de:
 * ✅ Convertir el DTO entrante desde gRPC a value objects de dominio
 * ✅ Ejecutar el caso de uso `Create__ProjectName__Command` a través del `CommandBus`
 * ✅ Transformar la entidad resultante en un objeto Protobuf para devolver al cliente
 *
 * 💡 Este controlador forma parte de la capa de **infraestructura**.
 * - No implementa lógica de negocio
 * - No accede a la base de datos directamente
 */

import { Controller } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { __projectNameCamel__ } from '@proto'

import { Create__ProjectName__Command } from '@__projectName__/microservice/application/ports/inbounds/commands'

import { __ProjectName__Mapper } from '@__projectName__/microservice/infrastructure/mappers/__projectName__.mapper'

import { __ProjectName__Entity } from '@__projectName__/microservice/domain/entities/__projectName__.entity'

@Controller()
export class Create__ProjectName__GrpcController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: __ProjectName__Mapper
  ) {}

  /**
   * ⚠️ NOTA IMPORTANTE:
   * Esta clase NO implementa la interfaz completa `__ProjectName__ServiceController`
   * ya que sólo expone un RPC (`create__ProjectName__`).
   * NestJS enlaza este método mediante reflexión usando
   * `@__ProjectName__ServiceControllerMethods()`.
   *
   * 👉 No uses `implements __ProjectName__ServiceController`
   */

  /**
   * Maneja el RPC `create__ProjectName__`.
   *
   * Flujo:
   * 1. Recibe un DTO desde gRPC (`Create__ProjectName__Dto`)
   * 2. Convierte los datos usando `__ProjectName__Mapper.protoToProps()`
   * 3. Ejecuta el comando `Create__ProjectName__Command` con esos datos
   * 4. El handler devuelve una entidad creada
   * 5. Se transforma en Protobuf y se responde
   *
   * @param request DTO gRPC generado desde `.proto`
   * @returns `__projectName__.__ProjectName__` (respuesta serializada)
   */
  @GrpcMethod(
    __projectNameCamel__.__ProjectName___SERVICE_NAME,
    'create__ProjectName__'
  )
  async create__ProjectName__(
    request: __projectNameCamel__.Create__ProjectName__Dto
  ): Promise<__projectNameCamel__.__ProjectName__> {
    const command = new Create__ProjectName__Command(
      request.name,
      request.description
    )

    const entity = await this.commandBus.execute<
      Create__ProjectName__Command, // comando que viaja
      __ProjectName__Entity // tipo que el handler devuelve
    >(command)

    return this.mapper.entityToProto(entity)
  }
}

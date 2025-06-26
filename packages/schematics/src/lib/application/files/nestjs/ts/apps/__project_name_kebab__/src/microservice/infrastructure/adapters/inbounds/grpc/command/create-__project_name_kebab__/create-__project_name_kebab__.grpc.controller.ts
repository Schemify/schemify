/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
/**
 * Create__project_name_pascal__GrpcController
 * -----------------------------------------------------------------------------
 * Controlador gRPC que maneja la operación `create__project_name_pascal__()` del servicio `__project_name_pascal__Service`.
 *
 * Se encarga de:
 * ✅ Convertir el DTO entrante desde gRPC a value objects de dominio
 * ✅ Ejecutar el caso de uso `Create__project_name_pascal__Command` a través del `CommandBus`
 * ✅ Transformar la entidad resultante en un objeto Protobuf para devolver al __project_name_camel__
 *
 * 💡 Este controlador forma parte de la capa de **infraestructura**.
 * - No implementa lógica de negocio
 * - No accede a la base de datos directamente
 */

import { Controller } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { __project_name_camel__ } from '@proto'

import { Create__project_name_pascal__Command } from '@__project_name_camel__/microservice/application/ports/inbounds/commands'

import { __project_name_pascal__Mapper } from '@__project_name_camel__/microservice/infrastructure/mappers/__project_name_camel__.mapper'

import { __project_name_pascal__Entity } from '@__project_name_camel__/microservice/domain/entities/__project_name_camel__.entity'

@Controller()
export class Create__project_name_pascal__GrpcController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: __project_name_pascal__Mapper
  ) {}

  /**
   * ⚠️ NOTA IMPORTANTE:
   * Esta clase NO implementa la interfaz completa `__project_name_pascal__ServiceController`
   * ya que sólo expone un RPC (`create__project_name_pascal__`).
   * NestJS enlaza este método mediante reflexión usando
   * `@__project_name_pascal__ServiceControllerMethods()`.
   *
   * 👉 No uses `implements __project_name_pascal__ServiceController`
   */

  /**
   * Maneja el RPC `create__project_name_pascal__`.
   *
   * Flujo:
   * 1. Recibe un DTO desde gRPC (`Create__project_name_pascal__Dto`)
   * 2. Convierte los datos usando `__project_name_pascal__Mapper.protoToProps()`
   * 3. Ejecuta el comando `Create__project_name_pascal__Command` con esos datos
   * 4. El handler devuelve una entidad creada
   * 5. Se transforma en Protobuf y se responde
   *
   * @param request DTO gRPC generado desde `.proto`
   * @returns `__project_name_camel__.__project_name_pascal__` (respuesta serializada)
   */
  @GrpcMethod('__project_name_pascal__Service', 'create__project_name_pascal__')
  async create__project_name_pascal__(
    request: __project_name_camel__.Create__project_name_pascal__Dto
  ): Promise<__project_name_camel__.__project_name_pascal__> {
    const command = new Create__project_name_pascal__Command(
      request.name,
      request.description
    )

    const entity = await this.commandBus.execute<
      Create__project_name_pascal__Command, // comando que viaja
      __project_name_pascal__Entity // tipo que el handler devuelve
    >(command)

    return this.mapper.entityToProto(entity)
  }
}

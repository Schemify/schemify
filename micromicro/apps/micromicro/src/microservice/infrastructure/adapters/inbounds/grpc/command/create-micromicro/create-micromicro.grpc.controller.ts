/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
/**
 * CreateMicromicroGrpcController
 * -----------------------------------------------------------------------------
 * Controlador gRPC que maneja la operación `createMicromicro()` del servicio `MicromicroService`.
 *
 * Se encarga de:
 * ✅ Convertir el DTO entrante desde gRPC a value objects de dominio
 * ✅ Ejecutar el caso de uso `CreateMicromicroCommand` a través del `CommandBus`
 * ✅ Transformar la entidad resultante en un objeto Protobuf para devolver al micromicro
 *
 * 💡 Este controlador forma parte de la capa de **infraestructura**.
 * - No implementa lógica de negocio
 * - No accede a la base de datos directamente
 */

import { Controller } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { micromicro } from '@proto'

import { CreateMicromicroCommand } from '@micromicro/microservice/application/ports/inbounds/commands'

import { MicromicroMapper } from '@micromicro/microservice/infrastructure/mappers/micromicro.mapper'

import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'

@Controller()
export class CreateMicromicroGrpcController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: MicromicroMapper
  ) {}

  /**
   * ⚠️ NOTA IMPORTANTE:
   * Esta clase NO implementa la interfaz completa `MicromicroServiceController`
   * ya que sólo expone un RPC (`createMicromicro`).
   * NestJS enlaza este método mediante reflexión usando
   * `@MicromicroServiceControllerMethods()`.
   *
   * 👉 No uses `implements MicromicroServiceController`
   */

  /**
   * Maneja el RPC `createMicromicro`.
   *
   * Flujo:
   * 1. Recibe un DTO desde gRPC (`CreateMicromicroDto`)
   * 2. Convierte los datos usando `MicromicroMapper.protoToProps()`
   * 3. Ejecuta el comando `CreateMicromicroCommand` con esos datos
   * 4. El handler devuelve una entidad creada
   * 5. Se transforma en Protobuf y se responde
   *
   * @param request DTO gRPC generado desde `.proto`
   * @returns `micromicro.Micromicro` (respuesta serializada)
   */
  @GrpcMethod('MicromicroService', 'createMicromicro')
  async createMicromicro(
    request: micromicro.CreateMicromicroDto
  ): Promise<micromicro.Micromicro> {
    const command = new CreateMicromicroCommand(
      request.name,
      request.description
    )

    const entity = await this.commandBus.execute<
      CreateMicromicroCommand, // comando que viaja
      MicromicroEntity // tipo que el handler devuelve
    >(command)

    return this.mapper.entityToProto(entity)
  }
}

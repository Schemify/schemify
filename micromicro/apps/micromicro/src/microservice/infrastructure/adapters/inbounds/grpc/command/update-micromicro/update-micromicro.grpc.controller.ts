/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
/**
 * UpdateMicromicroGrpcController
 * -----------------------------------------------------------------------------
 * Controlador gRPC que maneja la operación `updateMicromicro()` del servicio `MicromicroService`.
 *
 * Se encarga de:
 * ✅ Recibir el `id` y nuevos valores de actualización desde el DTO Protobuf
 * ✅ Ejecutar el caso de uso `UpdateMicromicroCommand` mediante el `CommandBus`
 * ✅ Convertir la entidad resultante en un objeto `micromicro.Micromicro` (Protobuf)
 *
 * Esta clase forma parte de la **capa de infraestructura**, y su función es
 * traducir el transporte en ejecución de lógica de aplicación.
 */

import { Controller } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { micromicro } from '@proto'

import { UpdateMicromicroCommand } from '@micromicro/microservice/application/ports/inbounds/commands'
import { MicromicroMapper } from '@micromicro/microservice/infrastructure/mappers/micromicro.mapper'

@Controller()
export class UpdateMicromicroGrpcController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: MicromicroMapper
  ) {}

  /**
   * ⚠️ NOTA IMPORTANTE:
   * Esta clase NO implementa la interfaz completa `MicromicroServiceController`
   * ya que sólo implementa el RPC `updateMicromicro`.
   * NestJS vincula el método usando reflexión con
   * `@MicromicroServiceControllerMethods()`.
   */

  /**
   * Maneja la llamada RPC `updateMicromicro`.
   *
   * Flujo:
   * 1. Recibe un DTO con el `id` y campos a actualizar
   * 2. Convierte los datos a objetos de valor mediante `MicromicroMapper`
   * 3. Ejecuta el comando `UpdateMicromicroCommand`
   * 4. El handler aplica cambios y retorna la entidad modificada
   * 5. Se transforma a Protobuf y se retorna al micromicro gRPC
   *
   * @param request DTO gRPC con los datos actualizables (`UpdateMicromicroDto`)
   * @returns micromicro.Micromicro` (respuesta actualizada)
   */

  @GrpcMethod('MicromicroService', 'updateMicromicro')
  async updateMicromicro(
    request: micromicro.UpdateMicromicroDto
  ): Promise<micromicro.Micromicro> {
    if (!request.micromicro) {
      throw new Error('Falta el objeto micromicro en el payload')
    }

    const props = this.mapper.protoToProps(request.micromicro)

    const command = new UpdateMicromicroCommand(
      request.id,
      props.name?.value,
      props.description?.value
    )

    const entity = await this.commandBus.execute(command)

    return this.mapper.entityToProto(entity)
  }
}

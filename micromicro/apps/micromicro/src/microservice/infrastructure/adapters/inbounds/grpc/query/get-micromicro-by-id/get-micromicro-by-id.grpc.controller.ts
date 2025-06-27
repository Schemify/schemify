/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
/**
 * GetMicromicroByIdGrpcController
 * -----------------------------------------------------------------------------
 * Controlador gRPC para manejar la operación `getMicromicroById()` del servicio `MicromicroService`.
 *
 * Se encarga de:
 * ✅ Ejecutar el caso de uso `GetMicromicroByIdQuery` usando el `QueryBus`
 * ✅ Convertir la entidad `MicromicroEntity` en una respuesta Protobuf (micromicro.Micromicro)
 * ✅ Devolver la respuesta al micromicro gRPC
 *
 * 🔒 No accede directamente a la base de datos.
 * 🔁 No contiene lógica de negocio (sólo delega y transforma).
 */

import { Controller } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { micromicro } from '@proto'

import { GetMicromicroByIdQuery } from '@micromicro/microservice/application/ports/inbounds/queries'
import { MicromicroMapper } from '@micromicro/microservice/infrastructure/mappers/micromicro.mapper'

@Controller('MicromicroService')
export class GetMicromicroByIdGrpcController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: MicromicroMapper
  ) {}

  /**
   * ⚠️ NOTA IMPORTANTE:
   * Esta clase NO implementa la interfaz completa `MicromicroServiceController`
   * ya que sólo expone un RPC (`getMicromicroById`).
   * NestJS vincula este método gracias al decorador
   * `@MicromicroServiceControllerMethods()` usando reflexión.
   *
   * 👉 No usar `implements MicromicroServiceController` para evitar errores TS2420
   */

  /**
   * Maneja la llamada RPC `getMicromicroById`.
   *
   * Flujo:
   *  1. Recibe un DTO con el `id` del ejemplo a buscar
   *  2. Ejecuta el caso de uso `GetMicromicroByIdQuery` a través del `QueryBus`
   *  3. El handler devuelve una entidad del dominio `MicromicroEntity`
   *  4. Se transforma en un objeto Protobuf (`micromicro.Micromicro`)
   *  5. Se retorna al micromicro gRPC
   *
   * @param request DTO generado desde el contrato gRPC (`.proto`)
   * @returns micromicro.Micromicro (objeto compatible con el contrato Protobuf)
   */

  @GrpcMethod(
    'MicromicroService',
    'getMicromicroById'
  )
  async getMicromicroById(
    request: micromicro.GetMicromicroByIdDto
  ): Promise<micromicro.Micromicro> {
    const query = new GetMicromicroByIdQuery({ id: request.id })

    const entity = await this.queryBus.execute(query)

    return this.mapper.entityToProto(entity)
  }
}

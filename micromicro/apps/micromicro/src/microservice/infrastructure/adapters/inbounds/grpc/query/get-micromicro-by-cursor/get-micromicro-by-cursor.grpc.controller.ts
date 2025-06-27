/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
/**
 * GetMicromicroByCursorGrpcController
 * -----------------------------------------------------------------------------
 * Controlador gRPC que maneja la operación `getMicromicroByCursor()` del servicio `MicromicroService`.
 *
 * Se encarga de:
 * ✅ Ejecutar el caso de uso `GetMicromicroByCursorQuery` usando `QueryBus`
 * ✅ Transformar los resultados del dominio a formato Protobuf
 * ✅ Devolver paginación cursor-based compatible con el contrato `.proto`
 *
 * ✔️ Alineado a CQRS
 * ✔️ Responsable de un solo caso de uso
 * ✔️ No contiene lógica de negocio
 */

import { Controller } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { micromicro } from '@proto'

import { CursorResult } from '@micromicro/libs/shared/interfaces/pagination/cursor-result.interface'

import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'

import { GetMicromicroByCursorQuery } from '@micromicro/microservice/application/ports/inbounds/queries'
import { MicromicroMapper } from '@micromicro/microservice/infrastructure/mappers/micromicro.mapper'

@Controller('MicromicroService')
export class GetMicromicroByCursorGrpcController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: MicromicroMapper
  ) {}

  /**
   * ⚠️ NOTA IMPORTANTE:
   * Esta clase NO implementa la interfaz completa `MicromicroServiceController`
   * ya que sólo expone un RPC (`getMicromicroByCursor`).
   * NestJS enlaza este método mediante reflexión con el decorador
   * `@MicromicroServiceControllerMethods()`.
   */

  /**
   * Maneja el RPC `getMicromicroByCursor`.
   *
   * Flujo:
   * 1. Recibe `afterId` y `limit` desde el request gRPC
   * 2. Ejecuta el query `GetMicromicroByCursorQuery` con esos parámetros
   * 3. El handler devuelve:
   *    - items (MicromicroEntity[])
   *    - nextCursor (string | null)
   *    - hasMore (boolean)
   * 4. Se transforma la salida al contrato `.proto`
   *
   * @param request objeto `CursorPaginationRequest` generado desde `.proto`
   * @returns CursorPaginatedMicromicro (protobuf)
   */

  @GrpcMethod(
    'MicromicroService',
    'getMicromicroByCursor'
  )
  async getMicromicroByCursor(
    request: micromicro.CursorPaginationRequest
  ): Promise<micromicro.CursorPaginatedMicromicro> {
    const query = new GetMicromicroByCursorQuery({
      afterId: request.afterId,
      limit: request.limit
    })

    const { items, nextCursor, hasMore } = await this.queryBus.execute<
      GetMicromicroByCursorQuery,
      CursorResult<MicromicroEntity>
    >(query)

    return {
      micromicro: items.map((e) => this.mapper.entityToProto(e)),
      nextCursor: nextCursor ?? '',
      hasMore
    }
  }
}

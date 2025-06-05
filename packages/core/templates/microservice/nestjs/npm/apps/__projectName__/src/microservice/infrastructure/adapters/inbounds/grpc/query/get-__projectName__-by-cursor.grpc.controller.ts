/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
/**
 * Get__ProjectName__sByCursorGrpcController
 * -----------------------------------------------------------------------------
 * Controlador gRPC que maneja la operación `get__ProjectName__sByCursor()` del servicio `__ProjectName__Service`.
 *
 * Se encarga de:
 * ✅ Ejecutar el caso de uso `Get__ProjectName__sByCursorQuery` usando `QueryBus`
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

import { __projectNameCamel__ } from '@proto'

import { CursorResult } from '@__projectName__/libs/shared/interfaces/pagination/cursor-result.interface'

import { __ProjectName__Entity } from '@__projectName__/microservice/domain/entities/__projectName__.entity'

import { Get__ProjectName__sByCursorQuery } from '@__projectName__/microservice/application/ports/inbounds/queries'
import { __ProjectName__Mapper } from '@__projectName__/microservice/infrastructure/mappers/__projectName__.mapper'


@Controller('__ProjectName__Service')
export class Get__ProjectName__sByCursorGrpcController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: __ProjectName__Mapper
  ) {}

  /**
   * ⚠️ NOTA IMPORTANTE:
   * Esta clase NO implementa la interfaz completa `__ProjectName__ServiceController`
   * ya que sólo expone un RPC (`get__ProjectName__sByCursor`).
   * NestJS enlaza este método mediante reflexión con el decorador
   * `@__ProjectName__ServiceControllerMethods()`.
   */

  /**
   * Maneja el RPC `get__ProjectName__sByCursor`.
   *
   * Flujo:
   * 1. Recibe `afterId` y `limit` desde el request gRPC
   * 2. Ejecuta el query `Get__ProjectName__sByCursorQuery` con esos parámetros
   * 3. El handler devuelve:
   *    - items (__ProjectName__Entity[])
   *    - nextCursor (string | null)
   *    - hasMore (boolean)
   * 4. Se transforma la salida al contrato `.proto`
   *
   * @param request objeto `CursorPaginationRequest` generado desde `.proto`
   * @returns CursorPaginated__ProjectName__s (protobuf)
   */

  @GrpcMethod(__projectNameCamel__.EXAMPLE_SERVICE_NAME, 'get__ProjectName__sByCursor')
  async get__ProjectName__sByCursor(
    request: __projectNameCamel__.CursorPaginationRequest
  ): Promise<__projectNameCamel__.CursorPaginated__ProjectName__s> {
    const query = new Get__ProjectName__sByCursorQuery({
      afterId: request.afterId,
      limit: request.limit
    })

    const { items, nextCursor, hasMore } = await this.queryBus.execute<
      Get__ProjectName__sByCursorQuery,
      CursorResult<__ProjectName__Entity>
    >(query)

    return {
      __projectNameCamel__s: items.map((e) => this.mapper.entityToProto(e)),
      nextCursor: nextCursor ?? '',
      hasMore
    }
  }
}

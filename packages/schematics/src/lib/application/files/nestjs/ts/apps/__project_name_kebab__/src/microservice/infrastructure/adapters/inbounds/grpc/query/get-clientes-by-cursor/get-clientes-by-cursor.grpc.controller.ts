/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
/**
 * Get__project_name_pascal__ByCursorGrpcController
 * -----------------------------------------------------------------------------
 * Controlador gRPC que maneja la operación `get__project_name_pascal__ByCursor()` del servicio `__project_name_pascal__Service`.
 *
 * Se encarga de:
 * ✅ Ejecutar el caso de uso `Get__project_name_pascal__ByCursorQuery` usando `QueryBus`
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

import { __project_name_kebab__ } from '@proto'

import { CursorResult } from '@__project_name_kebab__/libs/shared/interfaces/pagination/cursor-result.interface'

import { __project_name_pascal__Entity } from '@__project_name_kebab__/microservice/domain/entities/__project_name_kebab__.entity'

import { Get__project_name_pascal__ByCursorQuery } from '@__project_name_kebab__/microservice/application/ports/inbounds/queries'
import { __project_name_pascal__Mapper } from '@__project_name_kebab__/microservice/infrastructure/mappers/__project_name_kebab__.mapper'

@Controller('__project_name_pascal__Service')
export class Get__project_name_pascal__ByCursorGrpcController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: __project_name_pascal__Mapper
  ) {}

  /**
   * ⚠️ NOTA IMPORTANTE:
   * Esta clase NO implementa la interfaz completa `__project_name_pascal__ServiceController`
   * ya que sólo expone un RPC (`get__project_name_pascal__ByCursor`).
   * NestJS enlaza este método mediante reflexión con el decorador
   * `@__project_name_pascal__ServiceControllerMethods()`.
   */

  /**
   * Maneja el RPC `get__project_name_pascal__ByCursor`.
   *
   * Flujo:
   * 1. Recibe `afterId` y `limit` desde el request gRPC
   * 2. Ejecuta el query `Get__project_name_pascal__ByCursorQuery` con esos parámetros
   * 3. El handler devuelve:
   *    - items (__project_name_pascal__Entity[])
   *    - nextCursor (string | null)
   *    - hasMore (boolean)
   * 4. Se transforma la salida al contrato `.proto`
   *
   * @param request objeto `CursorPaginationRequest` generado desde `.proto`
   * @returns CursorPaginated__project_name_pascal__ (protobuf)
   */

  @GrpcMethod('ClientesService', 'getClientesByCursor')
  async getClientesByCursor(
    request: __project_name_kebab__.CursorPaginationRequest
  ): Promise<__project_name_kebab__.CursorPaginated__project_name_pascal__> {
    const query = new Get__project_name_pascal__ByCursorQuery({
      afterId: request.afterId,
      limit: request.limit
    })

    const { items, nextCursor, hasMore } = await this.queryBus.execute<
      Get__project_name_pascal__ByCursorQuery,
      CursorResult<__project_name_pascal__Entity>
    >(query)

    return {
      __project_name_camel__: items.map((e) => this.mapper.entityToProto(e)),
      nextCursor: nextCursor ?? '',
      hasMore
    }
  }
}

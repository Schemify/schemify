/**
 * GetMicroserviceNameByCursorHandler
 * -----------------------------------------------------------------------------
 * Handler que responde a la query `GetMicroserviceNameByCursorQuery`.
 *
 * 🔹 Esta clase forma parte de la **capa de aplicación**, implementando el patrón CQRS.
 * 🔹 Coordina la paginación basada en cursor para el agregado `MicroserviceNameEntity`.
 *
 * ✨ Responsabilidad:
 *  - Acceder al repositorio de lectura con paginación
 *  - Devolver entidades del dominio (`MicroserviceNameEntity[]`) junto a metadata de cursor
 *
 * 🚫 Este handler NO:
 *  - Mapea las entidades a DTOs/Protobuf
 *  - Maneja la lógica de presentación (eso lo hace la infraestructura)
 *
 * 🧠 Justificación arquitectónica:
 *  - Mantiene la lógica de paginación desacoplada del transporte
 *  - Cumple con los principios de separación de intereses (ISO/IEC 42010)
 *  - Compatible con múltiples adaptadores (REST, GraphQL, gRPC)
 *
 * 🔌 Dependencias:
 *  - `GetMicroserviceNameWithCursorPort`: puerto de salida del dominio para operaciones de lectura
 */

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'

import { GetMicroserviceNameByCursorQuery } from './get-microserviceName-by-cursor.query'

import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microserviceName.entity'

import { GetMicroserviceNameWithCursorPort } from '@microserviceName/microservice/application/ports/outbounds/repositories/microserviceName-query-ports'

@QueryHandler(GetMicroserviceNameByCursorQuery)
export class GetMicroserviceNameByCursorHandler
  implements IQueryHandler<GetMicroserviceNameByCursorQuery>
{
  constructor(
    @Inject(GetMicroserviceNameWithCursorPort)
    private readonly getMicroserviceNameWithCursorPort: GetMicroserviceNameWithCursorPort
  ) {}

  /**
   * Ejecuta la query con paginación basada en cursor.
   *
   * @param query Query con parámetros de paginación (`afterId`, `limit`)
   * @returns Objeto con:
   *  - `items`: lista de entidades
   *  - `nextCursor`: cursor para la siguiente página
   *  - `hasMore`: indicador si hay más datos
   */
  async execute(query: GetMicroserviceNameByCursorQuery): Promise<{
    items: MicroserviceNameEntity[]
    nextCursor: string | null
    hasMore: boolean
  }> {
    const { afterId, limit } = query.payload

    const result =
      await this.getMicroserviceNameWithCursorPort.getWithCursor(
        afterId,
        limit
      )

    return {
      items: result.items,
      nextCursor: result.nextCursor,
      hasMore: result.hasMore
    }
  }
}

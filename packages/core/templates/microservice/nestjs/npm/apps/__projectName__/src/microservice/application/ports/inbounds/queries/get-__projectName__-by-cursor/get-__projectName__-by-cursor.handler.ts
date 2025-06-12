/**
 * Get__ProjectName__sByCursorHandler
 * -----------------------------------------------------------------------------
 * Handler que responde a la query `Get__ProjectName__sByCursorQuery`.
 *
 * 🔹 Esta clase forma parte de la **capa de aplicación**, implementando el patrón CQRS.
 * 🔹 Coordina la paginación basada en cursor para el agregado `__ProjectName__Entity`.
 *
 * ✨ Responsabilidad:
 *  - Acceder al repositorio de lectura con paginación
 *  - Devolver entidades del dominio (`__ProjectName__Entity[]`) junto a metadata de cursor
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
 *  - `Get__ProjectName__sWithCursorPort`: puerto de salida del dominio para operaciones de lectura
 */

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'

import { Get__ProjectName__sByCursorQuery } from './get-__projectName__-by-cursor.query'

import { __ProjectName__Entity } from '@__projectName__/microservice/domain/entities/__projectName__.entity'

import { Get__ProjectName__sWithCursorPort } from '@__projectName__/microservice/application/ports/outbounds/repositories/__projectName__-query-ports'

@QueryHandler(Get__ProjectName__sByCursorQuery)
export class Get__ProjectName__sByCursorHandler
  implements IQueryHandler<Get__ProjectName__sByCursorQuery>
{
  constructor(
    @Inject(Get__ProjectName__sWithCursorPort)
    private readonly get__ProjectName__sWithCursorPort: Get__ProjectName__sWithCursorPort
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
  async execute(query: Get__ProjectName__sByCursorQuery): Promise<{
    items: __ProjectName__Entity[]
    nextCursor: string | null
    hasMore: boolean
  }> {
    const { afterId, limit } = query.payload

    const result = await this.get__ProjectName__sWithCursorPort.getWithCursor(
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

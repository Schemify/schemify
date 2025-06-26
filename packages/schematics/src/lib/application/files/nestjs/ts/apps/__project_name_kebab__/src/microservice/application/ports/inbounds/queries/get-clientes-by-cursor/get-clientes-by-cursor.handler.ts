/**
 * Get__project_name_pascal__ByCursorHandler
 * -----------------------------------------------------------------------------
 * Handler que responde a la query `Get__project_name_pascal__ByCursorQuery`.
 *
 * 🔹 Esta clase forma parte de la **capa de aplicación**, implementando el patrón CQRS.
 * 🔹 Coordina la paginación basada en cursor para el agregado `__project_name_pascal__Entity`.
 *
 * ✨ Responsabilidad:
 *  - Acceder al repositorio de lectura con paginación
 *  - Devolver entidades del dominio (`__project_name_pascal__Entity[]`) junto a metadata de cursor
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
 *  - `Get__project_name_pascal__WithCursorPort`: puerto de salida del dominio para operaciones de lectura
 */

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'

import { Get__project_name_pascal__ByCursorQuery } from './get-__project_name_kebab__-by-cursor.query'

import { __project_name_pascal__Entity } from '@__project_name_kebab__/microservice/domain/entities/__project_name_kebab__.entity'

import { Get__project_name_pascal__WithCursorPort } from '@__project_name_kebab__/microservice/application/ports/outbounds/repositories/__project_name_kebab__-query-ports'

@QueryHandler(Get__project_name_pascal__ByCursorQuery)
export class Get__project_name_pascal__ByCursorHandler
  implements IQueryHandler<Get__project_name_pascal__ByCursorQuery>
{
  constructor(
    @Inject(Get__project_name_pascal__WithCursorPort)
    private readonly get__project_name_pascal__WithCursorPort: Get__project_name_pascal__WithCursorPort
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
  async execute(query: Get__project_name_pascal__ByCursorQuery): Promise<{
    items: __project_name_pascal__Entity[]
    nextCursor: string | null
    hasMore: boolean
  }> {
    const { afterId, limit } = query.payload

    const result = await this.get__project_name_pascal__WithCursorPort.getWithCursor(
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

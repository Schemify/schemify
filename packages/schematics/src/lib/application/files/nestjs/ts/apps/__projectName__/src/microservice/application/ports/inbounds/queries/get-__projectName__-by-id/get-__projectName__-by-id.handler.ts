/**
 * Get__ProjectName__ByIdHandler
 * -----------------------------------------------------------------------------
 * Handler que responde a la query `Get__ProjectName__ByIdQuery`.
 *
 * 🔹 Esta clase forma parte de la **capa de aplicación**, implementando el patrón CQRS.
 * 🔹 Su responsabilidad es recuperar un agregado `__ProjectName__Entity` por su ID.
 *
 * ✨ Responsabilidad:
 *  - Acceder al repositorio de solo lectura (`Get__ProjectName__ByIdPort`)
 *  - Devolver una instancia completa del dominio (`__ProjectName__Entity`)
 *  - En caso de no encontrar el agregado, retornar `null`
 *
 * 🚫 Este handler NO:
 *  - Mapea la entidad a DTOs/Protobuf
 *  - Define detalles de presentación o transporte
 *
 * 🧠 Justificación arquitectónica:
 *  - Mantiene la lógica de negocio y el acceso desacoplado de la infraestructura
 *  - Permite que los adaptadores (gRPC/REST/etc.) manejen la presentación y errores
 *  - Facilita testing y mantiene el dominio puro
 *
 * 🔌 Dependencias:
 *  - `Get__ProjectName__ByIdPort`: puerto de salida para acceso de solo lectura
 */

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'

import { Get__ProjectName__ByIdQuery } from './get-__projectName__-by-id.query'

import { __ProjectName__Entity } from '@__projectName__/microservice/domain/entities/__projectName__.entity'

import { Get__ProjectName__ByIdPort } from '@__projectName__/microservice/application/ports/outbounds/repositories/__projectName__-query-ports'

@QueryHandler(Get__ProjectName__ByIdQuery)
export class Get__ProjectName__ByIdHandler
  implements IQueryHandler<Get__ProjectName__ByIdQuery>
{
  constructor(
    @Inject(Get__ProjectName__ByIdPort)
    private readonly queryRepository: Get__ProjectName__ByIdPort
  ) {}

  /**
   * Ejecuta la query `Get__ProjectName__ByIdQuery`.
   *
   * @param query Objeto con el ID del agregado a buscar
   * @returns `__ProjectName__Entity` si se encuentra, o `null` si no existe
   */
  async execute(
    query: Get__ProjectName__ByIdQuery
  ): Promise<__ProjectName__Entity | null> {
    return this.queryRepository.getById(query.payload.id)
  }
}

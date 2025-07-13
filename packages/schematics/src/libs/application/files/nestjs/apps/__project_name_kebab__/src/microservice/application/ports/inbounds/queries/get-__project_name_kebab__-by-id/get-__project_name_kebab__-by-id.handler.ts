/**
 * Get__project_name_camel__ByIdHandler
 * -----------------------------------------------------------------------------
 * Handler que responde a la query `Get__project_name_camel__ByIdQuery`.
 *
 * 🔹 Esta clase forma parte de la **capa de aplicación**, implementando el patrón CQRS.
 * 🔹 Su responsabilidad es recuperar un agregado `__project_name_pascal__Entity` por su ID.
 *
 * ✨ Responsabilidad:
 *  - Acceder al repositorio de solo lectura (`Get__project_name_camel__ByIdPort`)
 *  - Devolver una instancia completa del dominio (`__project_name_pascal__Entity`)
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
 *  - `Get__project_name_camel__ByIdPort`: puerto de salida para acceso de solo lectura
 */

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'

import { Get__project_name_camel__ByIdQuery } from './get-__project_name_kebab__-by-id.query'

import { __project_name_pascal__Entity } from 'apps/__project_name_kebab__/src/microservice/domain/entities/__project_name_kebab__.entity'

import { Get__project_name_camel__ByIdPort } from 'apps/__project_name_kebab__/src/microservice/application/ports/outbounds/repositories/__project_name_kebab__-query-ports'

@QueryHandler(Get__project_name_camel__ByIdQuery)
export class Get__project_name_camel__ByIdHandler
  implements IQueryHandler<Get__project_name_camel__ByIdQuery>
{
  constructor(
    @Inject(Get__project_name_camel__ByIdPort)
    private readonly queryRepository: Get__project_name_camel__ByIdPort
  ) {}

  /**
   * Ejecuta la query `Get__project_name_camel__ByIdQuery`.
   *
   * @param query Objeto con el ID del agregado a buscar
   * @returns `__project_name_pascal__Entity` si se encuentra, o `null` si no existe
   */
  async execute(
    query: Get__project_name_camel__ByIdQuery
  ): Promise<__project_name_pascal__Entity | null> {
    return this.queryRepository.getById(query.payload.id)
  }
}

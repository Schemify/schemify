/**
 * GetAll__ProjectName__sHandler
 * -----------------------------------------------------------------------------
 * Handler que responde a la query `GetAll__ProjectName__sQuery`.
 *
 * 🔹 Esta clase forma parte de la **capa de aplicación**, implementando el patrón CQRS.
 * 🔹 Orquesta la recuperación de todos los `__ProjectName__Entity` desde el puerto de lectura.
 *
 * ✨ Responsabilidad:
 *  - Invocar el repositorio de solo lectura (`GetAll__ProjectName__sPort`)
 *  - Devolver una lista de entidades completas del dominio
 *  - No contiene lógica de presentación ni mapeos a DTOs
 *
 * 🚫 Este handler NO:
 *  - Mapea entidades a objetos de transporte (DTOs, Protobuf, HTTP)
 *  - Accede directamente a infraestructura (ORM, base de datos)
 *  - Define filtros o paginación (usar otra query para eso)
 *
 * 🧠 Justificación arquitectónica:
 *  - Mantiene la separación de intereses (ISO/IEC 42010)
 *  - Respeta los principios de la arquitectura hexagonal (ports & adapters)
 *  - Facilita testing, evolución y desacoplamiento
 *
 * 🔌 Dependencias:
 *  - `GetAll__ProjectName__sPort`: puerto de salida del dominio
 */

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'


import { __ProjectName__Entity } from '@__projectName__/microservice/domain/entities/__projectName__.entity'

import { GetAll__ProjectName__sPort } from '@__projectName__/microservice/application/ports/outbounds/repositories/__projectName__-query-ports'
import { GetAll__ProjectName__sQuery } from './get-all-__projectName__.query'

@QueryHandler(GetAll__ProjectName__sQuery)
export class GetAll__ProjectName__sHandler
  implements IQueryHandler<GetAll__ProjectName__sQuery>
{
  constructor(
    @Inject(GetAll__ProjectName__sPort)
    private readonly getAll__ProjectName__Port: GetAll__ProjectName__sPort
  ) {}

  /**
   * Ejecuta la query `GetAll__ProjectName__sQuery`.
   *
   * @returns Lista de entidades del dominio `__ProjectName__Entity[]`
   */
  async execute(): Promise<__ProjectName__Entity[]> {
    return this.getAll__ProjectName__Port.getAll()
  }
}

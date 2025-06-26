/**
 * GetAll__project_name_pascal__Handler
 * -----------------------------------------------------------------------------
 * Handler que responde a la query `GetAll__project_name_pascal__Query`.
 *
 * 🔹 Esta clase forma parte de la **capa de aplicación**, implementando el patrón CQRS.
 * 🔹 Orquesta la recuperación de todos los `__project_name_pascal__Entity` desde el puerto de lectura.
 *
 * ✨ Responsabilidad:
 *  - Invocar el repositorio de solo lectura (`GetAll__project_name_pascal__Port`)
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
 *  - `GetAll__project_name_pascal__Port`: puerto de salida del dominio
 */

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'

import { __project_name_pascal__Entity } from '@__project_name_kebab__/microservice/domain/entities/__project_name_kebab__.entity'

import { GetAll__project_name_pascal__Port } from '@__project_name_kebab__/microservice/application/ports/outbounds/repositories/__project_name_kebab__-query-ports'
import { GetAll__project_name_pascal__Query } from './get-all-__project_name_kebab__.query'

@QueryHandler(GetAll__project_name_pascal__Query)
export class GetAll__project_name_pascal__Handler
  implements IQueryHandler<GetAll__project_name_pascal__Query>
{
  constructor(
    @Inject(GetAll__project_name_pascal__Port)
    private readonly getAll__project_name_pascal__Port: GetAll__project_name_pascal__Port
  ) {}

  /**
   * Ejecuta la query `GetAll__project_name_pascal__Query`.
   *
   * @returns Lista de entidades del dominio `__project_name_pascal__Entity[]`
   */
  async execute(): Promise<__project_name_pascal__Entity[]> {
    return this.getAll__project_name_pascal__Port.getAll()
  }
}

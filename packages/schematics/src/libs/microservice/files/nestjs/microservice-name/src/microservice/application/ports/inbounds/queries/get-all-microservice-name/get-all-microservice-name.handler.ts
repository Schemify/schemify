/**
 * GetAllMicroserviceNameHandler
 * -----------------------------------------------------------------------------
 * Handler que responde a la query `GetAllMicroserviceNameQuery`.
 *
 * 🔹 Esta clase forma parte de la **capa de aplicación**, implementando el patrón CQRS.
 * 🔹 Orquesta la recuperación de todos los `MicroserviceNameEntity` desde el puerto de lectura.
 *
 * ✨ Responsabilidad:
 *  - Invocar el repositorio de solo lectura (`GetAllMicroserviceNamePort`)
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
 *  - `GetAllMicroserviceNamePort`: puerto de salida del dominio
 */

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'

import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microserviceName.entity'

import { GetAllMicroserviceNamePort } from '@microserviceName/microservice/application/ports/outbounds/repositories/microserviceName-query-ports'
import { GetAllMicroserviceNameQuery } from './get-all-microserviceName.query'

@QueryHandler(GetAllMicroserviceNameQuery)
export class GetAllMicroserviceNameHandler
  implements IQueryHandler<GetAllMicroserviceNameQuery>
{
  constructor(
    @Inject(GetAllMicroserviceNamePort)
    private readonly getAllMicroserviceNamePort: GetAllMicroserviceNamePort
  ) {}

  /**
   * Ejecuta la query `GetAllMicroserviceNameQuery`.
   *
   * @returns Lista de entidades del dominio `MicroserviceNameEntity[]`
   */
  async execute(): Promise<MicroserviceNameEntity[]> {
    return this.getAllMicroserviceNamePort.getAll()
  }
}

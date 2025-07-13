/**
 * GetMicroserviceNameByIdHandler
 * -----------------------------------------------------------------------------
 * Handler que responde a la query `GetMicroserviceNameByIdQuery`.
 *
 * 🔹 Esta clase forma parte de la **capa de aplicación**, implementando el patrón CQRS.
 * 🔹 Su responsabilidad es recuperar un agregado `MicroserviceNameEntity` por su ID.
 *
 * ✨ Responsabilidad:
 *  - Acceder al repositorio de solo lectura (`GetMicroserviceNameByIdPort`)
 *  - Devolver una instancia completa del dominio (`MicroserviceNameEntity`)
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
 *  - `GetMicroserviceNameByIdPort`: puerto de salida para acceso de solo lectura
 */

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'

import { GetMicroserviceNameByIdQuery } from './get-microservice-name-by-id.query'

import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microservice-name.entity'

import { GetMicroserviceNameByIdPort } from '@microserviceName/microservice/application/ports/outbounds/repositories/microservice-name-query-ports'

@QueryHandler(GetMicroserviceNameByIdQuery)
export class GetMicroserviceNameByIdHandler
  implements IQueryHandler<GetMicroserviceNameByIdQuery>
{
  constructor(
    @Inject(GetMicroserviceNameByIdPort)
    private readonly queryRepository: GetMicroserviceNameByIdPort
  ) {}

  /**
   * Ejecuta la query `GetMicroserviceNameByIdQuery`.
   *
   * @param query Objeto con el ID del agregado a buscar
   * @returns `MicroserviceNameEntity` si se encuentra, o `null` si no existe
   */
  async execute(
    query: GetMicroserviceNameByIdQuery
  ): Promise<MicroserviceNameEntity | null> {
    return this.queryRepository.getById(query.payload.id)
  }
}

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'

import { Get__project_name_camel__ByIdQuery } from './get-__project_name_kebab__-by-id.query'

import { __project_name_pascal__Entity } from 'apps/__project_name_kebab__/src/microservice/domain/entities/__project_name_kebab__.entity'

import { Get__project_name_pascal__ByIdPort } from 'apps/__project_name_kebab__/src/microservice/application/ports/outbounds/repositories/__project_name_kebab__-query-ports'

@QueryHandler(Get__project_name_camel__ByIdQuery)
export class Get__project_name_camel__ByIdHandler
  implements IQueryHandler<Get__project_name_camel__ByIdQuery>
{
  constructor(
    @Inject(Get__project_name_pascal__ByIdPort)
    private readonly queryRepository: Get__project_name_pascal__ByIdPort
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

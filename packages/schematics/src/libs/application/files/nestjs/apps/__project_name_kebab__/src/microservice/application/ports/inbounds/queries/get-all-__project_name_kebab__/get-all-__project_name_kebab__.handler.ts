import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'

import { __project_name_pascal__Entity } from 'apps/__project_name_kebab__/src/microservice/domain/entities/__project_name_kebab__.entity'

import { GetAll__project_name_pascal__Port } from 'apps/__project_name_kebab__/src/microservice/application/ports/outbounds/repositories/__project_name_kebab__-query-ports'
import { GetAll__project_name_pascal__Query } from './get-all-__project_name_kebab__.query'

@QueryHandler(GetAll__project_name_pascal__Query)
export class GetAll__project_name_camel__Handler
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

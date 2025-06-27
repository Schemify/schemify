/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */

import { Controller } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { __project_name_camel__ } from '@proto'

import { Get__project_name_pascal__ByIdQuery } from '@__project_name_camel__/microservice/application/ports/inbounds/queries'
import { __project_name_pascal__Mapper } from '@__project_name_camel__/microservice/infrastructure/mappers/__project_name_camel__.mapper'

@Controller('__project_name_pascal__Service')
export class Get__project_name_pascal__ByIdGrpcController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: __project_name_pascal__Mapper
  ) {}

  @GrpcMethod(
    '__project_name_pascal__Service',
    'get__project_name_pascal__ById'
  )
  async get__project_name_pascal__ById(
    request: __project_name_camel__.Get__project_name_pascal__ByIdDto
  ): Promise<__project_name_camel__.__project_name_pascal__> {
    const query = new Get__project_name_pascal__ByIdQuery({ id: request.id })

    const entity = await this.queryBus.execute(query)

    return this.mapper.entityToProto(entity)
  }
}

/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */

import { Controller } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { __project_name_snake__ } from '@proto'

import { Get__project_name_camel__ByIdQuery } from 'apps/__project_name_kebab__/src/microservice/application/ports/inbounds/queries'
import { __project_name_pascal__Mapper } from 'apps/__project_name_kebab__/src/microservice/infrastructure/mappers/__project_name_kebab__.mapper'

@Controller('__project_name_camel__Service')
export class Get__project_name_camel__ByIdGrpcController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: __project_name_pascal__Mapper
  ) {}

  @GrpcMethod('__project_name_camel__Service', 'get__project_name_camel__ById')
  async get__project_name_camel__ById(
    request: __project_name_snake__.Get__project_name_pascal__ByIdDto
  ): Promise<__project_name_snake__.__project_name_pascal__> {
    const query = new Get__project_name_camel__ByIdQuery({ id: request.id })

    const entity = await this.queryBus.execute(query)

    return this.mapper.entityToProto(entity)
  }
}

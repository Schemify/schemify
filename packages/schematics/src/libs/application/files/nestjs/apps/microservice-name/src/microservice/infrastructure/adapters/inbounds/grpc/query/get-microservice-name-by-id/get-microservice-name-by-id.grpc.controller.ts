/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */

import { Controller } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { microservice_name } from '@proto'

import { GetMicroserviceNameByIdQuery } from '@microserviceName/microservice/application/ports/inbounds/queries'
import { MicroserviceNameMapper } from '@microserviceName/microservice/infrastructure/mappers/microservice-name.mapper'

@Controller('MicroserviceNameService')
export class GetMicroserviceNameByIdGrpcController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: MicroserviceNameMapper
  ) {}

  @GrpcMethod(
    'MicroserviceNameService',
    'getMicroserviceNameById'
  )
  async getMicroserviceNameById(
    request: microservice_name.GetMicroserviceNameByIdDto
  ): Promise<microservice_name.MicroserviceName> {
    const query = new GetMicroserviceNameByIdQuery({ id: request.id })

    const entity = await this.queryBus.execute(query)

    return this.mapper.entityToProto(entity)
  }
}

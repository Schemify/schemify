/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */

import { Controller } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { microserviceName } from '@proto'

import { GetMicroserviceNameByIdQuery } from '@microserviceName/microservice/application/ports/inbounds/queries'
import { MicroserviceNameMapper } from '@microserviceName/microservice/infrastructure/mappers/microserviceName.mapper'

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
    request: microserviceName.GetMicroserviceNameByIdDto
  ): Promise<microserviceName.MicroserviceName> {
    const query = new GetMicroserviceNameByIdQuery({ id: request.id })

    const entity = await this.queryBus.execute(query)

    return this.mapper.entityToProto(entity)
  }
}

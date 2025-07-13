/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */

import { Controller } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { __project_name_snake__ } from '@proto'

import { CursorResult } from 'apps/__project_name_kebab__/src/libs/shared/interfaces/pagination/cursor-result.interface'

import { __project_name_pascal__Entity } from 'apps/__project_name_kebab__/src/microservice/domain/entities/__project_name_kebab__.entity'

import { Get__project_name_camel__ByCursorQuery } from 'apps/__project_name_kebab__/src/microservice/application/ports/inbounds/queries'
import { __project_name_pascal__Mapper } from 'apps/__project_name_kebab__/src/microservice/infrastructure/mappers/__project_name_kebab__.mapper'

@Controller('__project_name_camel__Service')
export class Get__project_name_camel__ByCursorGrpcController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: __project_name_pascal__Mapper
  ) {}

  @GrpcMethod(
    '__project_name_camel__Service',
    'get__project_name_camel__ByCursor'
  )
  async get__project_name_camel__ByCursor(
    request: __project_name_snake__.CursorPaginationRequest
  ): Promise<__project_name_snake__.CursorPaginated__project_name_pascal__> {
    const query = new Get__project_name_camel__ByCursorQuery({
      afterId: request.afterId,
      limit: request.limit
    })

    const { items, nextCursor, hasMore } = await this.queryBus.execute<
      Get__project_name_camel__ByCursorQuery,
      CursorResult<__project_name_pascal__Entity>
    >(query)

    return {
      __project_name_camel__: items.map((e) => this.mapper.entityToProto(e)),
      nextCursor: nextCursor ?? '',
      hasMore
    }
  }
}

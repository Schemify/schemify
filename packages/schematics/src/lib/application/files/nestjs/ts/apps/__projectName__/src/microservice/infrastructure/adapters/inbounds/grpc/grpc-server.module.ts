import { Module } from '@nestjs/common'
import { Transport, MicroserviceOptions } from '@nestjs/microservices'
import { CqrsModule } from '@nestjs/cqrs'

import { GrpcQueryControllers } from './query'
import { GrpcCommandControllers } from './command'

import { __projectNameCamel__ } from '@proto'
import { PROTO_PATHS } from '@__projectName__/microservice/infrastructure/shared/constants/proto-paths'

import { SharedModule } from '@__projectName__/libs/shared/shared.module'

import { ApplicationModule } from '@__projectName__/microservice/application/application.module'

@Module({
  imports: [CqrsModule, SharedModule, ApplicationModule],
  controllers: [...GrpcQueryControllers, ...GrpcCommandControllers]
})
export class GrpcServerModule {
  static transport(): MicroserviceOptions {
    return {
      transport: Transport.GRPC,
      options: {
        package: __projectNameCamel__.__ProjectName___PACKAGE_NAME,
        protoPath: PROTO_PATHS.__projectNameCamel__,
        url: process.env.SERVICE_GRPC_URL
      }
    }
  }
}

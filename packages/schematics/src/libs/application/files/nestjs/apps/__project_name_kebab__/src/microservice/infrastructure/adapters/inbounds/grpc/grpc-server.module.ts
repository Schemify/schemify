import { Module } from '@nestjs/common'
import { Transport, MicroserviceOptions } from '@nestjs/microservices'
import { CqrsModule } from '@nestjs/cqrs'

import { GrpcQueryControllers } from './query'
import { GrpcCommandControllers } from './command'

import { __project_name_snake__ } from '@proto'
import { PROTO_PATHS } from 'apps/__project_name_kebab__/src/microservice/infrastructure/shared/constants/proto-paths'

import { SharedModule } from 'apps/__project_name_kebab__/src/libs/shared/shared.module'

import { ApplicationModule } from 'apps/__project_name_kebab__/src/microservice/application/application.module'

@Module({
  imports: [CqrsModule, SharedModule, ApplicationModule],
  controllers: [...GrpcQueryControllers, ...GrpcCommandControllers]
})
export class GrpcServerModule {
  static transport(): MicroserviceOptions {
    return {
      transport: Transport.GRPC,
      options: {
        package: __project_name_snake__.__project_name_screaming___PACKAGE_NAME,
        protoPath: PROTO_PATHS.__project_name_camel__,
        url: process.env.SERVICE_GRPC_URL
      }
    }
  }
}

import { Module } from '@nestjs/common'
import { Transport, MicroserviceOptions } from '@nestjs/microservices'
import { CqrsModule } from '@nestjs/cqrs'

import { GrpcQueryControllers } from './query'
import { GrpcCommandControllers } from './command'

import { __project_name_kebab__ } from '@proto'
import { PROTO_PATHS } from '@__project_name_kebab__/microservice/infrastructure/shared/constants/proto-paths'

import { SharedModule } from '@__project_name_kebab__/libs/shared/shared.module'

import { ApplicationModule } from '@__project_name_kebab__/microservice/application/application.module'

@Module({
  imports: [CqrsModule, SharedModule, ApplicationModule],
  controllers: [...GrpcQueryControllers, ...GrpcCommandControllers]
})
export class GrpcServerModule {
  static transport(): MicroserviceOptions {
    return {
      transport: Transport.GRPC,
      options: {
        package: __project_name_kebab__.CLIENTES_PACKAGE_NAME,
        protoPath: PROTO_PATHS.__project_name_kebab__,
        url: process.env.SERVICE_GRPC_URL
      }
    }
  }
}

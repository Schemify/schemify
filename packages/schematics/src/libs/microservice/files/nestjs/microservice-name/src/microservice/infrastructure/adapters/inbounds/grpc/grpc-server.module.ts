import { Module } from '@nestjs/common'
import { Transport, MicroserviceOptions } from '@nestjs/microservices'
import { CqrsModule } from '@nestjs/cqrs'

import { GrpcQueryControllers } from './query'
import { GrpcCommandControllers } from './command'

import { microserviceName } from '@proto'
import { PROTO_PATHS } from '@microserviceName/microservice/infrastructure/shared/constants/proto-paths'

import { SharedModule } from '@microserviceName/libs/shared/shared.module'

import { ApplicationModule } from '@microserviceName/microservice/application/application.module'

@Module({
  imports: [CqrsModule, SharedModule, ApplicationModule],
  controllers: [...GrpcQueryControllers, ...GrpcCommandControllers]
})
export class GrpcServerModule {
  static transport(): MicroserviceOptions {
    return {
      transport: Transport.GRPC,
      options: {
        package: microserviceName.MICROSERVICE_NAME_PACKAGE_NAME,
        protoPath: PROTO_PATHS.microserviceName,
        url: process.env.SERVICE_GRPC_URL
      }
    }
  }
}

import { Module } from '@nestjs/common'
import { Transport, MicroserviceOptions } from '@nestjs/microservices'
import { CqrsModule } from '@nestjs/cqrs'

import { GrpcQueryControllers } from './query'
import { GrpcCommandControllers } from './command'

import { micromicro } from '@proto'
import { PROTO_PATHS } from '@micromicro/microservice/infrastructure/shared/constants/proto-paths'

import { SharedModule } from '@micromicro/libs/shared/shared.module'

import { ApplicationModule } from '@micromicro/microservice/application/application.module'

@Module({
  imports: [CqrsModule, SharedModule, ApplicationModule],
  controllers: [...GrpcQueryControllers, ...GrpcCommandControllers]
})
export class GrpcServerModule {
  static transport(): MicroserviceOptions {
    return {
      transport: Transport.GRPC,
      options: {
        package: micromicro.MICROMICRO_PACKAGE_NAME,
        protoPath: PROTO_PATHS.micromicro,
        url: process.env.SERVICE_GRPC_URL
      }
    }
  }
}

import { MicroserviceOptions, Transport } from '@nestjs/microservices'

import { join } from 'path'
import { micromicro } from '@proto'

import { PROTO_PATHS } from '@micromicro/microservice/infrastructure/shared/constants/proto-paths'

export function grpcServerOptions(): MicroserviceOptions {
  return {
    transport: Transport.GRPC,
    options: {
      package: micromicro.Micromicro_PACKAGE_NAME,
      protoPath: join(__dirname, '..', PROTO_PATHS.micromicro),
      url: process.env.SERVICE_GRPC_URL
    }
  }
}

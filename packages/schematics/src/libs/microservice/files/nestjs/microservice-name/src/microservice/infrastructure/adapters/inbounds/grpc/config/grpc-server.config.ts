import { MicroserviceOptions, Transport } from '@nestjs/microservices'

import { join } from 'path'
import { microserviceName } from '@proto'

import { PROTO_PATHS } from '@microserviceName/microservice/infrastructure/shared/constants/proto-paths'

export function grpcServerOptions(): MicroserviceOptions {
  return {
    transport: Transport.GRPC,
    options: {
      package: microserviceName.MICROSERVICE_NAME_PACKAGE_NAME,
      protoPath: join(__dirname, '..', PROTO_PATHS.microserviceName),
      url: process.env.SERVICE_GRPC_URL
    }
  }
}

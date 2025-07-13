import { MicroserviceOptions, Transport } from '@nestjs/microservices'

import { join } from 'path'
import { microservice_name } from '@proto'

import { PROTO_PATHS } from '@microserviceName/microservice/infrastructure/shared/constants/proto-paths'

export function grpcServerOptions(): MicroserviceOptions {
  return {
    transport: Transport.GRPC,
    options: {
      package: microservice_name.MICROSERVICE_NAME_PACKAGE_NAME,
      protoPath: Object.values(PROTO_PATHS).map((p) =>
        join(__dirname, '..', p as string)
      ),
      url: process.env.SERVICE_GRPC_URL
    }
  }
}

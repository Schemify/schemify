import { MicroserviceOptions, Transport } from '@nestjs/microservices'

import { join } from 'path'
import { __project_name_camel__ } from '@proto'

import { PROTO_PATHS } from '@__project_name_camel__/microservice/infrastructure/shared/constants/proto-paths'

export function grpcServerOptions(): MicroserviceOptions {
  return {
    transport: Transport.GRPC,
    options: {
      package: __project_name_camel__.__project_name_screaming___PACKAGE_NAME,
      protoPath: join(__dirname, '..', PROTO_PATHS.__project_name_camel__),
      url: process.env.SERVICE_GRPC_URL
    }
  }
}

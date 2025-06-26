import { MicroserviceOptions, Transport } from '@nestjs/microservices'

import { join } from 'path'
import { __project_name_kebab__ } from '@proto'

import { PROTO_PATHS } from '@__project_name_kebab__/microservice/infrastructure/shared/constants/proto-paths'

export function grpcServerOptions(): MicroserviceOptions {
  return {
    transport: Transport.GRPC,
    options: {
      package: __project_name_kebab__.__project_name_pascal___PACKAGE_NAME,
      protoPath: join(__dirname, '..', PROTO_PATHS.__project_name_kebab__),
      url: process.env.SERVICE_GRPC_URL
    }
  }
}

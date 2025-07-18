import { MicroserviceOptions, Transport } from '@nestjs/microservices'

import { join } from 'path'
import { __project_name_snake__ } from '@proto'

import { PROTO_PATHS } from 'apps/__project_name_kebab__/src/microservice/infrastructure/shared/constants/proto-paths'

export function grpcServerOptions(): MicroserviceOptions {
  return {
    transport: Transport.GRPC,
    options: {
      package: __project_name_snake__.__project_name_screaming___PACKAGE_NAME,
      protoPath: Object.values(PROTO_PATHS).map((p) =>
        join(__dirname, '..', p)
      ),
      url: process.env.SERVICE_GRPC_URL
    }
  }
}

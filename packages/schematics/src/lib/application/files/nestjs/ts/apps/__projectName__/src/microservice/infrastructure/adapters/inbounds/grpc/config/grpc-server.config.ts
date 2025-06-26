import { MicroserviceOptions, Transport } from '@nestjs/microservices'

import { join } from 'path'
import { __projectNameCamel__ } from '@proto'

import { PROTO_PATHS } from '@__projectName__/microservice/infrastructure/shared/constants/proto-paths'

export function grpcServerOptions(): MicroserviceOptions {
  return {
    transport: Transport.GRPC,
    options: {
      package: __projectNameCamel__.__ProjectName___PACKAGE_NAME,
      protoPath: join(__dirname, '..', PROTO_PATHS.__projectNameCamel__),
      url: '0.0.0.0:50051'
    }
  }
}

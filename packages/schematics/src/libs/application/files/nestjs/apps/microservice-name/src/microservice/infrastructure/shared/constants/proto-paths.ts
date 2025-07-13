import { join, resolve } from 'path'

const PROTO_ROOT = resolve(__dirname, '../../../libs/proto/src')

export const PROTO_PATHS = {
  microserviceName: join(
    PROTO_ROOT,
    'microservice-name',
    'microservice-name.proto'
  ),
  microserviceName_events: join(
    PROTO_ROOT,
    'events',
    'microservice-name',
    'microservice-name-events.proto'
  )
} as const

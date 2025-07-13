import { join } from 'path'

const PROTO_ROOT = join(process.cwd(), 'libs', 'proto', 'src')
export const PROTO_PATHS = {
  microserviceName: join(
    PROTO_ROOT,
    'microserviceName',
    'microserviceName.proto'
  )
} as const

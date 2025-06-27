import { join } from 'path'

const PROTO_ROOT = join(process.cwd(), 'dist', 'libs', 'proto', 'src')

export const PROTO_PATHS = {
  micromicro: join(
    PROTO_ROOT,
    'micromicro',
    'micromicro.proto'
  )
} as const

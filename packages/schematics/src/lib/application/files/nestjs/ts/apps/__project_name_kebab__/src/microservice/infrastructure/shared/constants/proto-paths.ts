import { join } from 'path'

const PROTO_ROOT = join(process.cwd(), 'dist', 'libs', 'proto', 'src')

export const PROTO_PATHS = {
  __project_name_camel__: join(
    PROTO_ROOT,
    '__project_name_camel__',
    '__project_name_camel__.proto'
  )
} as const

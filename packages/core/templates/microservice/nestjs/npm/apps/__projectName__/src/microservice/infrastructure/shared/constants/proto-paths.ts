import { join } from 'path'

const PROTO_ROOT = join(process.cwd(), 'dist', 'libs', 'proto', 'src')

export const PROTO_PATHS = {
  __projectNameCamel__: join(
    PROTO_ROOT,
    '__projectName__',
    '__projectName__.proto'
  )
}

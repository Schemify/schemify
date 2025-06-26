import { join } from 'path'

const PROTO_ROOT = join(process.cwd(), 'dist', 'libs', 'proto', 'src')

export const PROTO_PATHS = {
  __project_name_kebab__: join(PROTO_ROOT, '__project_name_kebab__', '__project_name_kebab__.proto')
} as const

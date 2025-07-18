import { join, resolve } from 'path'

const PROTO_ROOT = resolve(__dirname, './proto')

export const PROTO_PATHS = {
  __project_name_camel__: join(
    PROTO_ROOT,
    '__project_name_kebab__',
    '__project_name_kebab__.proto'
  ),
  __project_name_camel___events: join(
    PROTO_ROOT,
    'events',
    '__project_name_kebab__',
    '__project_name_kebab__-events.proto'
  )
} as const

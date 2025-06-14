import { generateModule } from './generate-module.js'
import { generateEvent } from './generate-event.js'

export async function handleGenerate(
  type: string,
  name: string,
  options: { path: string }
) {
  switch (type.toLowerCase()) {
    case 'module':
      return generateModule(name, options.path)
    case 'event':
      return generateEvent(name, options.path)
    default:
      throw new Error(`Unsupported generate type: "${type}"`)
  }
}

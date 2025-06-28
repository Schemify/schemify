// import path from 'path'

// import { ApplicationOptions } from '@schemifyjs/types'

// import { generateNameVariants } from '../../shared/utils/generate-name-variants.util.js'

// import { SchematicEngine } from '../../shared/utils/generate-project.util.js'

// import { runInstallCommand } from './commands/install.command.js'
// import { fileURLToPath } from 'url'

// const __dirname = path.dirname(fileURLToPath(import.meta.url))

// export interface ApplicationScaffolderOptions extends ApplicationOptions {
//   versions?: Record<string, string>
// }

// export class ApplicationScaffolder {
//   async scaffold(schemify: ApplicationOptions): Promise<void> {
//     const outputPath = path.resolve(schemify.name)
//     const schematicPath = path.resolve(
//       __dirname,
//       '../application/files/nestjs/ts'
//     )

//     // Usar las versiones recibidas en el objeto options
//     const replacements = {
//       ...generateNameVariants(schemify.name),
//       ...(schemify.versions || {})
//     }

//     await SchematicEngine({
//       schematicPath: schematicPath,
//       outputPath: outputPath,
//       replacements: replacements
//     })

//     await runInstallCommand(outputPath)
//   }
// }

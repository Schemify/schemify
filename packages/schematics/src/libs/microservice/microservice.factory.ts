// import path from 'path'
// import { fileURLToPath } from 'url'
// import { GenerateArtifactOptions } from '@schemifyjs/types'
// import { SchematicEngine } from '../../engine/schematic-engine.js'
// import { generateNameVariants } from '../../shared/utils/generate-name-variants.util.js'

// const __dirname = path.dirname(fileURLToPath(import.meta.url))

// export class MicroserviceScaffolder {
//   async scaffold(options: GenerateArtifactOptions): Promise<void> {
//     if (options.type !== 'microservice') {
//       throw new Error(
//         `Invalid artifact type for MicroserviceScaffolder: ${options.type}`
//       )
//     }

//     // ⬇️ Output en apps/__project_name_kebab__
//     const outputPath = path.resolve('apps', options.name)

//     const schematicPath = path.resolve(
//       __dirname,
//       '../microservice/files',
//       options.framework
//     )

//     const replacements = {
//       ...generateNameVariants(options.name),
//       ...(options.versions ?? {})
//     }

//     await SchematicEngine({
//       schematicPath,
//       outputPath,
//       replacements
//     })
//   }
// }

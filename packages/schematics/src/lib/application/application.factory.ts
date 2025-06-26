import path from 'path'

import { ApplicationOptions } from '@schemifyjs/types'

import { generateNameVariants } from '../../shared/utils/generate-name-variants.util.js'

import { SchematicEngine } from '../../shared/utils/generate-project.util.js'

import { runInstallCommand } from './commands/install.command.js'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export class ApplicationScaffolder {
  async scaffold(schemify: ApplicationOptions): Promise<void> {
    const outputPath = path.resolve(schemify.name)
    const schematicPath = path.resolve(
      __dirname,
      '../application/files/nestjs/ts'
    )

    await SchematicEngine({
      schematicPath: schematicPath,
      outputPath: outputPath,
      replacements: generateNameVariants(schemify.name)
    })

    await runInstallCommand(outputPath)
  }
}

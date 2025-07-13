import chalk from 'chalk'
import path from 'path'
import { fileURLToPath } from 'url'

import { type TemplateGenerationOptions } from './types/template-generation-options.interface.js'

import { copyTemplateFiles } from './utils/copy-template-files.util.js'
import { processDirectory } from './utils/process-directory.util.js'
import { renameGitignore } from './utils/rename-gitignore.util.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function SchematicEngine(
  options: TemplateGenerationOptions
): Promise<void> {
  const { schematicPath, outputPath, replacements } = options

  console.log(chalk.blue('📦 Copying template files...'))
  await copyTemplateFiles(schematicPath, outputPath)

  console.log(chalk.blue('🔧 Applying replacements...'))
  await processDirectory(outputPath, replacements)

  await renameGitignore(outputPath)

  console.log(
    chalk.green(`✅ Project successfully generated at: ${outputPath}`)
  )
}

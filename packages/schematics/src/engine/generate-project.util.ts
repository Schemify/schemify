import path from 'path'
import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import chalk from 'chalk'

export interface TemplateGenerationOptions {
  schematicPath: string
  outputPath: string
  replacements: Record<string, string>
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const BINARY_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.ico',
  '.pdf',
  '.zip'
])

export async function SchematicEngine(
  options: TemplateGenerationOptions
): Promise<void> {
  const { schematicPath, outputPath, replacements } = options

  if (!(await fs.pathExists(schematicPath))) {
    console.error(chalk.red(`❌ Template not found: ${schematicPath}`))
    throw new Error(`Template not found: ${schematicPath}`)
  }

  console.log(chalk.blue('📦 Copying template files...'))
  await fs.copy(schematicPath, outputPath, {
    overwrite: true,
    filter: (src) =>
      !['node_modules', 'dist', '.DS_Store'].includes(path.basename(src))
  })

  console.log(chalk.blue('🔧 Applying replacements...'))
  await processDirectory(outputPath, replacements)

  await renameGitignore(outputPath)

  console.log(
    chalk.green(`✅ Project successfully generated at: ${outputPath}`)
  )
}

async function processDirectory(
  dir: string,
  replacements: Record<string, string>
): Promise<void> {
  const entries = await fs.readdir(dir)

  for (const entry of entries) {
    const currentPath = path.join(dir, entry)
    const stats = await fs.stat(currentPath)

    const replacedName = applyReplacements(entry, replacements)
    const newPath = path.join(dir, replacedName)

    if (replacedName !== entry) {
      await fs.move(currentPath, newPath)
    }

    if (stats.isDirectory()) {
      await processDirectory(newPath, replacements)
    } else if (!isBinaryFile(newPath)) {
      const content = await fs.readFile(newPath, 'utf-8')
      const updated = applyReplacements(content, replacements)
      if (content !== updated) {
        await fs.writeFile(newPath, updated)
      }
    }
  }
}

function applyReplacements(
  input: string,
  replacements: Record<string, string>
): string {
  let result = input

  for (const [key, val] of Object.entries(replacements)) {
    const patterns = [
      new RegExp(`__${key}__`, 'g'),
      new RegExp(`{{${key}}}`, 'g')
    ]
    for (const pattern of patterns) {
      result = result.replace(pattern, val)
    }
  }

  return result
}

function isBinaryFile(filePath: string): boolean {
  return BINARY_EXTENSIONS.has(path.extname(filePath).toLowerCase())
}

async function renameGitignore(targetDir: string): Promise<void> {
  const filePath = path.join(targetDir, 'gitignore')
  const newPath = path.join(targetDir, '.gitignore')
  if (await fs.pathExists(filePath)) {
    await fs.move(filePath, newPath, { overwrite: true })
    console.log(chalk.yellow('📝 Renamed gitignore → .gitignore'))
  }
}

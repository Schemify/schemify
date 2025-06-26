import path from 'path'
import fs from 'fs-extra'
import { fileURLToPath } from 'url'

export interface TemplateGenerationOptions {
  schematicPath: string
  outputPath: string
  replacements: Record<string, string>
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const BINARY_EXTENSIONS = [
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.ico',
  '.pdf',
  '.zip'
]

export async function SchematicEngine(
  schemify: TemplateGenerationOptions
): Promise<void> {
  const src = schemify.schematicPath
  const dest = schemify.outputPath

  if (!(await fs.pathExists(src))) {
    throw new Error(`❌ Plantilla no encontrada: ${src}`)
  }

  await fs.copy(src, dest, {
    overwrite: true,
    filter: (srcPath) =>
      !['node_modules', 'dist', '.DS_Store'].includes(path.basename(srcPath))
  })

  await walkAndReplace(dest, schemify.replacements)

  const gitignore = path.join(dest, 'gitignore')
  if (await fs.pathExists(gitignore)) {
    await fs.move(gitignore, path.join(dest, '.gitignore'), { overwrite: true })
  }

  console.log(`✅ Proyecto generado en: ${dest}`)
}

async function walkAndReplace(
  currentPath: string,
  replacements: Record<string, string>
) {
  const entries = await fs.readdir(currentPath)

  for (const entry of entries) {
    const originalPath = path.join(currentPath, entry)
    const stats = await fs.stat(originalPath)

    const newName = applyReplacements(entry, replacements)
    const newPath = path.join(currentPath, newName)

    if (newName !== entry) await fs.move(originalPath, newPath)

    if (stats.isDirectory()) {
      await walkAndReplace(newPath, replacements)
    } else if (!isBinaryFile(newPath)) {
      const content = await fs.readFile(newPath, 'utf-8')
      const updated = applyReplacements(content, replacements)
      if (updated !== content) await fs.writeFile(newPath, updated)
    }
  }
}

function applyReplacements(
  input: string,
  dict: Record<string, string>
): string {
  let result = input

  // Reemplazar formato __variable__
  result = Object.entries(dict).reduce(
    (acc, [key, val]) => acc.replace(new RegExp(`__${key}__`, 'g'), val),
    result
  )

  // Reemplazar formato {{variable}}
  result = Object.entries(dict).reduce(
    (acc, [key, val]) => acc.replace(new RegExp(`{{${key}}}`, 'g'), val),
    result
  )

  return result
}

function isBinaryFile(filePath: string): boolean {
  return BINARY_EXTENSIONS.includes(path.extname(filePath).toLowerCase())
}

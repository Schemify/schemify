import fs from 'fs-extra'
import path from 'path'
import { TemplateNotFoundError } from '../errors/template-not-found.error.js'

export async function copyTemplateFiles(
  source: string,
  destination: string
): Promise<void> {
  const exists = await fs.pathExists(source)
  if (!exists) throw new TemplateNotFoundError(source)

  await fs.copy(source, destination, {
    overwrite: true,
    filter: (src) =>
      !['node_modules', 'dist', '.DS_Store'].includes(path.basename(src))
  })
}

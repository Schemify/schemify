import fs from 'fs-extra'
import path from 'path'
import { applyReplacements } from './apply-replacements.js'
import { isBinaryFile } from './binary-file.util.js'

export async function processDirectory(
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

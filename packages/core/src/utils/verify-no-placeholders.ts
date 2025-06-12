import fs from 'fs-extra'
import path from 'path'

const TEXT_EXTENSIONS = [
  '.ts',
  '.json',
  '.md',
  '.env',
  '.yml',
  '.yaml',
  '.sh',
  '.mjs',
  '.js',
  '.txt'
]

export async function verifyNoPlaceholders(root: string): Promise<void> {
  const unresolved: string[] = []

  async function walk(dir: string) {
    const entries = await fs.readdir(dir)

    for (const entry of entries) {
      const fullPath = path.join(dir, entry)
      const stat = await fs.stat(fullPath)

      if (stat.isDirectory()) {
        await walk(fullPath)
      } else {
        const ext = path.extname(entry)
        if (!TEXT_EXTENSIONS.includes(ext)) continue

        const content = await fs.readFile(fullPath, 'utf-8')
        if (content.match(/{{\w+}}/)) {
          unresolved.push(fullPath)
        }
      }
    }
  }

  await walk(root)

  if (unresolved.length > 0) {
    console.error('❌ Archivos con placeholders sin reemplazar:')
    unresolved.forEach((file) => console.error('  -', file))
    throw new Error('Reemplazo incompleto de placeholders.')
  }

  console.log('✅ Todos los placeholders fueron reemplazados correctamente.')
}

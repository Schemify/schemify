import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Lista de carpetas de assets a copiar
const assetsToCopy = [
  {
    from: path.resolve(__dirname, '../src/libs/application/files'),
    to: path.resolve(__dirname, '../dist/libs/application/files')
  }
  //   {
  //     from: path.resolve(__dirname, '../src/lib/shared/templates'),
  //     to: path.resolve(__dirname, '../dist/lib/shared/templates')
  //   }
]

for (const { from, to } of assetsToCopy) {
  try {
    const exists = await fs.pathExists(from)
    if (!exists) {
      console.warn(`⚠️  Ruta no encontrada: ${from}`)
      continue
    }

    await fs.copy(from, to)
    console.log(`✅ Copiado: ${from} → ${to}`)
  } catch (err) {
    console.error(`❌ Error copiando de ${from} a ${to}:`, err)
  }
}

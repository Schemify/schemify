import {
  readdirSync,
  statSync,
  readFileSync,
  writeFileSync,
  renameSync
} from 'fs'
import { join, extname } from 'path'

/**
 * Extensiones de archivos binarios que no deben ser procesados como texto.
 */
const BINARY_EXTENSIONS = [
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.ico',
  '.pdf',
  '.zip'
]

/**
 * Reemplaza todos los placeholders en contenido y nombres de archivos/carpetas.
 * Aplica de forma recursiva desde `baseDir`.
 */
export function replacePlaceholders(
  baseDir: string,
  replacements: Record<string, string>
) {
  /**
   * Determina si el archivo es binario por su extensión.
   */
  const isBinaryFile = (filePath: string) =>
    BINARY_EXTENSIONS.includes(extname(filePath).toLowerCase())

  /**
   * Reemplaza placeholders en el contenido de un archivo.
   */
  const replaceInContent = (filePath: string) => {
    if (isBinaryFile(filePath)) return

    const original = readFileSync(filePath, 'utf-8')
    const updated = applyReplacements(original, replacements)

    if (updated !== original) {
      writeFileSync(filePath, updated)
    }
  }

  /**
   * Aplica los reemplazos tipo __KEY__ → value.
   */
  const applyReplacements = (input: string, dict: Record<string, string>) =>
    Object.entries(dict).reduce(
      (acc, [key, val]) => acc.replace(new RegExp(`__${key}__`, 'g'), val),
      input
    )

  /**
   * Recorre recursivamente todos los archivos y carpetas dentro de baseDir.
   */
  const walk = (currentPath: string) => {
    for (const entry of readdirSync(currentPath)) {
      const fullPath = join(currentPath, entry)
      const stats = statSync(fullPath)

      // Reemplaza nombres de archivos o carpetas (si contienen __KEY__)
      let newFullPath = fullPath
      const replacedName = applyReplacements(entry, replacements)

      if (replacedName !== entry) {
        newFullPath = join(currentPath, replacedName)
        renameSync(fullPath, newFullPath)
      }

      // Si es directorio, baja recursivamente
      if (stats.isDirectory()) {
        walk(newFullPath)
      } else {
        replaceInContent(newFullPath)
      }
    }
  }

  walk(baseDir)
}

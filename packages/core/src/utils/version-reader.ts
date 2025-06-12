import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Utilidad que encapsula la lectura de versiones desde package.json locales.
 * Sigue el patrón de diseño: Singleton (para evitar múltiples lecturas innecesarias)
 */
export class VersionReader {
  private static instance: VersionReader
  private cache: Record<string, string> = {}

  private constructor() {}

  static getInstance(): VersionReader {
    if (!VersionReader.instance) {
      VersionReader.instance = new VersionReader()
    }
    return VersionReader.instance
  }

  getLocalVersion(pkgFolder: string): string {
    if (this.cache[pkgFolder]) return this.cache[pkgFolder]

    const pkgPath = path.resolve(__dirname, '../../', pkgFolder, 'package.json')
    const content = fs.readFileSync(pkgPath, 'utf-8')
    const version = `^${JSON.parse(content).version}`
    this.cache[pkgFolder] = version
    return version
  }

  getSchemifyVersions(): Record<string, string> {
    return {
      schemifyCliVersion: this.getLocalVersion('cli'),
      schemifyCoreVersion: this.getLocalVersion('core'),
      schemifyTypesVersion: this.getLocalVersion('types')
    }
  }
}

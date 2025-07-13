import fs from 'fs'

export class ProjectNotFoundValidator {
  static validate(basePath: string): void {
    if (!fs.existsSync(basePath)) {
      throw new Error(`Project not found at: ${basePath}`)
    }
  }
}

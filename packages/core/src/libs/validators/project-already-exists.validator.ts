import fs from 'fs'
import path from 'path'

export class ProjectAlreadyExistsValidator {
  static validate(projectPath?: string): void {
    if (!projectPath) {
      throw new Error(`❌ 'projectPath' is required but was undefined.`)
    }

    const fullPath = path.resolve(projectPath)
    if (fs.existsSync(fullPath)) {
      throw new Error(`Project already exists at: ${fullPath}`)
    }
  }
}

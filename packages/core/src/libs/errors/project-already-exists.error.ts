import fs from 'fs-extra'

export class ProjectAlreadyExistsError extends Error {
  constructor(projectPath: string) {
    super(`A project already exists at: ${projectPath}`)
    this.name = 'ProjectAlreadyExistsError'
  }

  static validate(projectPath: string): void {
    if (fs.existsSync(projectPath)) {
      throw new ProjectAlreadyExistsError(projectPath)
    }
  }
}

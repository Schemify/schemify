import fs from 'fs-extra'

export class ProjectNotFoundError extends Error {
  constructor(projectPath: string) {
    super(`No project was found at: ${projectPath}`)
    this.name = 'ProjectNotFoundError'
  }

  static validate(projectPath: string): void {
    if (!fs.existsSync(projectPath)) {
      throw new ProjectNotFoundError(projectPath)
    }
  }
}

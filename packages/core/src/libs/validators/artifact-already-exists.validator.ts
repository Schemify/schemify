import fs from 'fs'
import path from 'path'

export class ArtifactAlreadyExistsValidator {
  static validate(name: string, type: string, basePath: string): void {
    const artifactPath = path.join(basePath, type, name)
    if (fs.existsSync(artifactPath)) {
      throw new Error(
        `Artifact "${name}" of type "${type}" already exists at ${artifactPath}`
      )
    }
  }
}

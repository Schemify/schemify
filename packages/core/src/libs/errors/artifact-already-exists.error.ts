import fs from 'fs-extra'
import path from 'path'

export class ArtifactAlreadyExistsError extends Error {
  constructor(artifactName: string, artifactType: string, fullPath: string) {
    super(
      `An artifact of type "${artifactType}" with the name "${artifactName}" already exists at ${fullPath}.`
    )
    this.name = 'ArtifactAlreadyExistsError'
  }

  static validate(
    artifactName: string,
    artifactType: string,
    basePath: string
  ): void {
    const fullPath = path.join(basePath, artifactName)
    if (fs.existsSync(fullPath)) {
      throw new ArtifactAlreadyExistsError(artifactName, artifactType, fullPath)
    }
  }
}

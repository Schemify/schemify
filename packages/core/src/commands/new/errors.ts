export class ProjectAlreadyExistsError extends Error {
  constructor(projectPath: string) {
    super(
      `Ya existe un proyecto o carpeta con ese nombre en el directorio actual: ${projectPath}`
    )
    this.name = 'ProjectAlreadyExistsError'
  }
}

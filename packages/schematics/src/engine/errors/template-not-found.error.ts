export class TemplateNotFoundError extends Error {
  constructor(schematicPath: string) {
    super(`❌ Template not found: ${schematicPath}`)
    this.name = 'TemplateNotFoundError'
  }
}

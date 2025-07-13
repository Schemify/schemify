export interface TemplateGenerationOptions {
  /**
   * Ruta absoluta al directorio de la plantilla (esqueleto de archivos).
   */
  schematicPath: string

  /**
   * Ruta donde se generará el nuevo proyecto (directorio de destino).
   */
  outputPath: string

  /**
   * Diccionario clave/valor con los placeholders y sus valores de reemplazo.
   * Ejemplo: { projectName: 'my-app' } reemplazará `__projectName__` y `{{projectName}}`.
   */
  replacements: Record<string, string>
}

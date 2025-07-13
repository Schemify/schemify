import path from 'path'
import { fileURLToPath } from 'url'
import { type NewProjectOptions } from '@schemifyjs/types'
import { generateNameVariants } from '../../shared/utils/generate-name-variants.util.js'
import { SchematicEngine } from '../../engine/schematic-engine.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function scaffoldApplication(
  projectOptions: NewProjectOptions
): Promise<void> {
  // Si projectOptions.metadata.path existe, usa path/name; si no, usa solo name
  const outputPath = path.resolve(
    projectOptions.metadata.path
      ? path.join(projectOptions.metadata.path, projectOptions.metadata.name)
      : projectOptions.metadata.name
  )

  const projectNames = generateNameVariants(
    projectOptions.metadata.name,
    'project_name_real'
  )

  const microserviceNames = projectOptions.microservice
    ? generateNameVariants(projectOptions.microservice.name, 'project_name')
    : {}

  const replacements = {
    ...projectNames,
    ...microserviceNames,
    ...(projectOptions.versions ?? {})
  }

  const schematicPath = path.resolve(
    __dirname,
    '../application/files',
    projectOptions.framework ?? 'nestjs'
  )

  await SchematicEngine({
    schematicPath,
    outputPath,
    replacements
  })
}

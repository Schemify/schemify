import { type NewSchemify } from '@schemifyjs/types'
import { type ApplicationOptions } from '@schemifyjs/types'
import { askApplicationOptions } from '../../prompts/application/application.prompt.js'
import { ApplicationScaffolder } from '@schemifyjs/schematics'
import fs from 'fs-extra'
import path from 'path'
import { validateNewProjectName } from './validate.js'
import { ProjectAlreadyExistsError } from './errors.js'
import { SCHEMIFY_CORE_VERSIONS } from '../../constants/core-versions.js'

export async function runNewCommandHandler(
  newSchemify: NewSchemify
): Promise<void> {
  // 1. Validar nombre
  validateNewProjectName(newSchemify.name)

  // 2. Validar existencia de carpeta
  const projectPath = path.resolve(newSchemify.name)
  if (await fs.pathExists(projectPath)) {
    throw new ProjectAlreadyExistsError(projectPath)
  }

  // 3. Pedir opciones adicionales
  const applicationOptions = await askApplicationOptions()
  const schemify: ApplicationOptions = {
    name: newSchemify.name,
    framework: applicationOptions.framework,
    packageManager: applicationOptions.packageManager,
    versions: {
      schemifyCliVersion: SCHEMIFY_CORE_VERSIONS['@schemifyjs/cli'],
      schemifyCoreVersion: SCHEMIFY_CORE_VERSIONS['@schemifyjs/core'],
      schemifyTypesVersion: SCHEMIFY_CORE_VERSIONS['@schemifyjs/types'],
      schemifySchematicsVersion:
        SCHEMIFY_CORE_VERSIONS['@schemifyjs/schematics']
    }
  }

  // 4. Ejecutar scaffolder
  const scaffolder = new ApplicationScaffolder()
  await scaffolder.scaffold(schemify)
}

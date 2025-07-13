import { ProjectMetadata, NewProjectOptions } from '@schemifyjs/types'
import { scaffoldApplication } from '@schemifyjs/schematics'

import * as validator from '../../libs/validators/indext.js'

// Definition of Version
import { buildSchemifyVersions } from '../../utils/options.util.js'
import { askNewProjectQuestions } from '../../libs/questions/prompts/new-project.prompts.js'

export async function runNewCommand(
  projectMetadata: ProjectMetadata
): Promise<void> {
  // TODO : Add validation for projectMetadata
  // validator.ProjectAlreadyExistsValidator.validate(projectMetadata.path!)
  // validator.ProjectNotFoundValidator.validate(projectMetadata.path!)
  // validator.NameValidator.validate(projectMetadata.name)

  const answers = await askNewProjectQuestions()

  const options: NewProjectOptions = {
    metadata: {
      name: projectMetadata.name,
      path: projectMetadata.path
    },
    microservice: {
      name: answers.name
    },
    packageManager: answers.packageManager,
    framework: answers.framework,
    versions: buildSchemifyVersions()
  }

  await scaffoldApplication(options)
}

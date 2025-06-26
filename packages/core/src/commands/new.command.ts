import { type NewSchemify } from '@schemifyjs/types'
import { type ApplicationOptions } from '@schemifyjs/types'

import { askApplicationOptions } from '../prompts/application/application.prompt.js'
import { ApplicationScaffolder } from '@schemifyjs/schematics'

export async function runNewCommand(newSchemify: NewSchemify): Promise<void> {
  // Ask the rest options from the user
  const applicationOptions = await askApplicationOptions()

  // Merge the options with the newSchemify object
  const schemify: ApplicationOptions = {
    name: newSchemify.name,
    framework: applicationOptions.framework,
    packageManager: applicationOptions.packageManager
  }

  // execute scaffolder
  const scaffolder = new ApplicationScaffolder()
  await scaffolder.scaffold(schemify)
}

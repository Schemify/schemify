import enquirer from 'enquirer'

import { type ApplicationOptions } from '@schemifyjs/types'
import { FrameworkType, PackageManagerType } from '@schemifyjs/types'

export async function askApplicationOptions(): Promise<
  Omit<ApplicationOptions, 'name'>
> {
  const { prompt } = enquirer

  const answers = await prompt([
    {
      type: 'select',
      name: 'framework',
      message: 'Which framework would you like to use?',
      choices: Object.values(FrameworkType)
    },
    {
      type: 'select',
      name: 'packageManager',
      message: 'Which package manager do you prefer?',
      choices: Object.values(PackageManagerType)
    }
  ])

  return answers as Omit<ApplicationOptions, 'name'>
}

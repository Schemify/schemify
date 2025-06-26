import enquirer from 'enquirer'

import { type ApplicationOptions } from '@schemifyjs/types'
import { FrameworkType, PackageManagerType } from '@schemifyjs/types'

export async function askApplicationOptions(): Promise<
  Omit<ApplicationOptions, 'name'>
> {
  try {
    const { prompt } = enquirer

    const answers = (await prompt([
      {
        type: 'select',
        name: 'framework',
        message: 'Which framework would you like to use?',
        choices: Object.values(FrameworkType),
        validate: (value: string) => {
          if (
            !value ||
            !Object.values(FrameworkType).includes(value as FrameworkType)
          ) {
            return 'Please select a valid framework'
          }
          return true
        }
      },
      {
        type: 'select',
        name: 'packageManager',
        message: 'Which package manager do you prefer?',
        choices: Object.values(PackageManagerType),
        validate: (value: string) => {
          if (
            !value ||
            !Object.values(PackageManagerType).includes(
              value as PackageManagerType
            )
          ) {
            return 'Please select a valid package manager'
          }
          return true
        }
      }
    ])) as { framework: FrameworkType; packageManager: PackageManagerType }

    if (!answers || !answers.framework || !answers.packageManager) {
      throw new Error('User cancelled the prompt or provided invalid options')
    }

    return answers as Omit<ApplicationOptions, 'name'>
  } catch (error) {
    if (error instanceof Error) {
      // Handle enquirer specific errors
      if (
        error.message.includes('User cancelled') ||
        error.message.includes('cancelled')
      ) {
        throw new Error('Operation cancelled by user')
      }
      if (
        error.message.includes('ENOENT') ||
        error.message.includes('permission')
      ) {
        throw new Error('Permission denied or file system error')
      }
      throw new Error(`Failed to get user input: ${error.message}`)
    }
    throw new Error('An unexpected error occurred while prompting for options')
  }
}

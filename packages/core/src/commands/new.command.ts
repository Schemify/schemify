import { type NewSchemify } from '@schemifyjs/types'
import { type ApplicationOptions } from '@schemifyjs/types'

import { askApplicationOptions } from '../prompts/application/application.prompt.js'
import { ApplicationScaffolder } from '@schemifyjs/schematics'

export async function runNewCommand(newSchemify: NewSchemify): Promise<void> {
  try {
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
  } catch (error) {
    if (error instanceof Error) {
      // Provide more specific error messages based on the error type
      if (error.message.includes('cancelled')) {
        throw new Error('Operation was cancelled by the user')
      }
      if (
        error.message.includes('permission') ||
        error.message.includes('ENOENT')
      ) {
        throw new Error(
          'Permission denied. Check your file system permissions.'
        )
      }
      if (
        error.message.includes('network') ||
        error.message.includes('fetch')
      ) {
        throw new Error('Network error. Check your internet connection.')
      }
      // Re-throw with more context
      throw new Error(`Failed to create new application: ${error.message}`)
    }
    throw new Error(
      'An unexpected error occurred while creating the application'
    )
  }
}

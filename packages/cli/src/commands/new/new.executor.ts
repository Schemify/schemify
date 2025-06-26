import { NewSchemify } from '@schemifyjs/types'
import { runNewCommandHandler } from '@schemifyjs/core'
import {
  withErrorHandling,
  ValidationError
} from '../../utils/error-handler.js'

export class NewCommand {
  constructor(private readonly newSchemify: NewSchemify) {}

  async execute(): Promise<void> {
    // Validate input
    this.validateInput()

    // Execute with error handling
    await withErrorHandling(async () => {
      await runNewCommandHandler(this.newSchemify)
    }, 'Failed to create new application')
  }

  private validateInput(): void {
    const { name } = this.newSchemify

    if (!name || typeof name !== 'string') {
      throw new ValidationError(
        'Project name is required and must be a string.',
        ['Provide a valid name for your project']
      )
    }

    if (name.length < 1) {
      throw new ValidationError('Project name cannot be empty.', [
        'Provide a name with at least 1 character'
      ])
    }

    if (name.length > 50) {
      throw new ValidationError('Project name is too long.', [
        'Use a name with maximum 50 characters'
      ])
    }
  }
}

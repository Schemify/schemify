import { Command } from 'commander'
import { NewCommand } from './new.executor.js'
import { ErrorHandler, ValidationError } from '../../utils/error-handler.js'

export function registerNewCommand(program: Command) {
  program
    .command('new [name]')
    .alias('n')
    .description('Generate Schemify application.')
    .showHelpAfterError()
    .action(handleNewCommand)
}

async function handleNewCommand(name?: string): Promise<void> {
  try {
    if (!name) {
      throw new ValidationError('You must specify a project name.', [
        'Example: schemify new my-project',
        'The name must be valid for a project directory'
      ])
    }

    // Validate project name
    if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
      throw new ValidationError(
        'The project name contains invalid characters.',
        [
          'Use only letters, numbers, hyphens (-) and underscores (_)',
          'Example: schemify new my-project-123'
        ]
      )
    }

    const command = new NewCommand({ name })
    await command.execute()
  } catch (error) {
    ErrorHandler.handle(error)
    process.exit(1)
  }
}

import { Command } from 'commander'
import { NewCommand } from './new.executor.js'
import { ErrorHandler } from '../../utils/error-handler.js'
import {
  validateCliProjectName,
  ensureProjectNameProvided
} from './validate.js'

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
    ensureProjectNameProvided(name)
    validateCliProjectName(name!)
    const command = new NewCommand({ name: name! })
    await command.execute()
  } catch (error) {
    ErrorHandler.handle(error)
    process.exit(1)
  }
}

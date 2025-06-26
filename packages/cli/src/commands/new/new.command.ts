import { Command } from 'commander'
import { NewCommand } from './new.executor.js'

export function registerNewCommand(program: Command) {
  program
    .command('new [name]')
    .alias('n')
    .description('Generate Schemify application.')
    .showHelpAfterError()
    .action(handleNewCommand)
}

async function handleNewCommand(name?: string): Promise<void> {
  if (!name) {
    console.error('❌ Debes especificar un nombre de proyecto.')
    process.exit(1)
  }

  const command = new NewCommand({ name })
  await command.execute()
}

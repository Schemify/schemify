import { Command } from 'commander'
import chalk from 'chalk'

export function configureHelp(program: Command) {
  program
    .helpOption('-h, --help', 'Display help information')
    .helpCommand(false)
    .addHelpText(
      'afterAll',
      chalk.gray('\nRun `schemify new --help` for project options.\n')
    )
}

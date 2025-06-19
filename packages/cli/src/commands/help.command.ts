import { Command } from 'commander'

export function registerHelpCommand(program: Command) {
  program
    .helpOption('-h, --help', 'Output usage information.')
    .helpCommand(false)
}

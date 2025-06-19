import { Command } from 'commander'

export function registerNewCommand(program: Command) {
  program
    .command('new')
    .alias('n')
    .usage('[options] [name]')
    .description('Generate Schemify application.')
    .showHelpAfterError()
}

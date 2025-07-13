import { Command } from 'commander'
import { executeNewCommand } from './new.executor.js'

export function registerNewCommand(program: Command) {
  program
    .command('new <name>')
    .alias('n')
    .description('Generate Schemify application.')
    .option('-p, --path <path>', 'Custom path to create the project in')
    .showHelpAfterError()
    .action((name, cmd) => {
      executeNewCommand(name, cmd)
    })
}

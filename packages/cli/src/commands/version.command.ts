import { Command } from 'commander'
import { version as CLIVersion } from '../version.js'

export function registerVersionCommand(program: Command) {
  program
    .name('schemify')
    .usage('<command> [options]')
    .version(CLIVersion, '-v, --version', 'Output the current version.')
}

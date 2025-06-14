import { Command } from 'commander'
import { version as CLIVersion } from './version.js'
import { configureHelp } from './config/help.config.js'

import { registerNewCommand } from './commands/new/new.command.js'

export class CLIArgumentParser {
  private program = new Command()

  constructor() {
    this.setup()
  }

  private setup(): void {
    this.program
      .name('schemify')
      .usage('<command> [options]')
      .description(
        'Create and manage microservice projects using advanced templates'
      )
      .version(CLIVersion, '-v, --version', 'Show current CLI version')
      .showHelpAfterError(true)

    // 🧩 Modular config
    configureHelp(this.program)
    registerNewCommand(this.program)
  }

  public async parse(argv = process.argv): Promise<void> {
    const userArgs = argv.slice(2)
    if (userArgs.length === 0) {
      this.program.outputHelp()
      process.exit(0)
    }

    await this.program.parseAsync(argv)
  }
}

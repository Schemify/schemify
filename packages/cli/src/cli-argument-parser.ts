import { Command } from 'commander'
import { withErrorHandling } from './utils/error-handler.js'

import { registerHelpCommand } from './commands/help.command.js'
import { registerVersionCommand } from './commands/version.command.js'
import { registerGenerateCommand } from './commands/generate/generate.command.js'
import { registerNewCommand } from './commands/new/new.command.js'

export class CLIArgumentParser {
  private program = new Command()

  constructor() {
    this.setupConfiguration()
    this.setupCommands()
  }

  private setupConfiguration(): void {
    this.program.showHelpAfterError(true)
  }

  private setupCommands(): void {
    registerHelpCommand(this.program)
    registerVersionCommand(this.program)
    registerNewCommand(this.program)
    registerGenerateCommand(this.program)
  }

  public async parse(argv = process.argv): Promise<void> {
    await withErrorHandling(async () => {
      const userArgs = argv.slice(2)
      if (userArgs.length === 0) {
        this.program.outputHelp()
        process.exit(0)
      }

      await this.program.parseAsync(argv)
    }, 'Failed to parse CLI arguments')
  }
}

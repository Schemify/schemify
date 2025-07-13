import chalk from 'chalk'
import { CliErrorType } from './error-types.js'

export class ErrorHandler {
  static handle(error: unknown, options?: { exitCode?: number }): void {
    const exitCode = options?.exitCode ?? 1

    if (error instanceof Error) {
      this.logError(error)
    } else {
      console.error(chalk.red('❌ An unknown error occurred.'))
    }

    process.exit(exitCode)
  }

  private static logError(error: Error): void {
    const isKnownCliError = Object.values(CliErrorType).includes(
      error.name as CliErrorType
    )

    console.error(chalk.redBright(`\n❌ ${error.name}: ${error.message}`))

    if (!isKnownCliError) {
      console.error(chalk.gray(error.stack ?? 'No stack trace available.'))
    }
  }
}

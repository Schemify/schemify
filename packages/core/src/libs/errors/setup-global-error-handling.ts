import chalk from 'chalk'
import { ErrorHandler } from './error-handler.js'

export function setupGlobalErrorHandling(): void {
  process.on('unhandledRejection', (reason) => {
    console.error(chalk.red('\nUnhandled Promise Rejection:'))
    ErrorHandler.handle(reason)
  })

  process.on('uncaughtException', (error) => {
    console.error(chalk.red('\nUncaught Exception:'))
    ErrorHandler.handle(error)
  })

  process.on('SIGINT', () => {
    console.log(chalk.yellow('\nOperation cancelled by user (SIGINT).'))
    process.exit(0)
  })

  process.on('SIGTERM', () => {
    console.log(chalk.yellow('\nProcess terminated (SIGTERM).'))
    process.exit(0)
  })
}

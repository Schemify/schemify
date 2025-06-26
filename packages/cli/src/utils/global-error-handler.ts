import { ErrorHandler } from './error-handler.js'

/**
 * Global error handler for unhandled promise rejections and exceptions
 * Similar to NestJS global exception filter
 */
export function setupGlobalErrorHandling(): void {
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Promise Rejection:')
    ErrorHandler.handle(reason)
    process.exit(1)
  })

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:')
    ErrorHandler.handle(error)
    process.exit(1)
  })

  // Handle SIGINT (Ctrl+C)
  process.on('SIGINT', () => {
    console.log('\n\nOperation cancelled by user.')
    process.exit(0)
  })

  // Handle SIGTERM
  process.on('SIGTERM', () => {
    console.log('\n\nProcess terminated.')
    process.exit(0)
  })
}

/**
 * Graceful shutdown handler
 */
export function setupGracefulShutdown(): void {
  const gracefulShutdown = (signal: string) => {
    console.log(`\n\nReceived ${signal}. Shutting down gracefully...`)
    process.exit(0)
  }

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
  process.on('SIGINT', () => gracefulShutdown('SIGINT'))
}

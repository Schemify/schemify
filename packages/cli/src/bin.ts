#!/usr/bin/env node
import { runCLI } from './index.js'
import { ErrorHandler } from './utils/error-handler.js'
import {
  setupGlobalErrorHandling,
  setupGracefulShutdown
} from './utils/global-error-handler.js'

// Setup global error handling
setupGlobalErrorHandling()
setupGracefulShutdown()

runCLI().catch((error) => {
  ErrorHandler.handle(error)
  process.exit(1)
})

import { Command } from 'commander'

import { runNewCommandHandler } from '@schemifyjs/core'
import {
  ensureProjectNameProvided,
  validateCliProjectName
} from './new.validator.js'
import { ErrorHandler } from '../../utils/error-handler.js'

export async function executeNewCommand(name?: string, cmd?: Command) {
  const options = cmd?.opts?.() ?? {}
  try {
    ensureProjectNameProvided(name)
    validateCliProjectName(name!)

    const newSchemify = {
      name: name!,
      ...options
    }

    await runNewCommandHandler({ name: newSchemify.name! })
  } catch (error) {
    ErrorHandler.handle(error)
    process.exit(1)
  }
}

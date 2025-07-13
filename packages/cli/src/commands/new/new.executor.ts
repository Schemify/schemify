import { Command } from 'commander'

import { runNewCommand } from '@schemifyjs/core'

import {
  ensureProjectNameProvided,
  validateCliProjectName
} from './new.validator.js'
import { ErrorHandler } from '../../utils/error-handler.js'

export async function executeNewCommand(
  name: string,
  cmd: { path: string }
): Promise<void> {
  try {
    // console.log('DEBUG name:', name)
    // console.log('DEBUG options:', cmd.path)

    ensureProjectNameProvided(name)
    validateCliProjectName(name)

    const newSchemify = {
      name: name,
      path: cmd.path
    }

    await runNewCommand(newSchemify)
  } catch (error) {
    ErrorHandler.handle(error)
    process.exit(1)
  }
}

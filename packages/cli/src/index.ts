import { CLIArgumentParser } from './cli-argument-parser.js'
import { checkForUpdate } from './utils/check-update.js'
import { withErrorHandling } from './utils/error-handler.js'

export async function runCLI() {
  await withErrorHandling(async () => {
    checkForUpdate()
    const parser = new CLIArgumentParser()
    await parser.parse()
  }, 'CLI execution failed')
}

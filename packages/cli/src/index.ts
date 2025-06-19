import { CLIArgumentParser } from './cli-argument-parser.js'
import { checkForUpdate } from './utils/check-update.js'

export async function runCLI() {
  checkForUpdate()
  const parser = new CLIArgumentParser()
  await parser.parse()
}

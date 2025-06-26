import { Command } from 'commander'
import { handleGenerate } from '../../utils/generators/generate-handler.js'
import { ErrorHandler, ValidationError } from '../../utils/error-handler.js'

export function registerGenerateCommand(program: Command) {
  program
    .command('generate <type> <name>')
    .alias('g')
    .description('Generate code artifacts (module, event, dto, etc.)')
    .option('-p, --path <path>', 'Base path to generate into', 'src/')
    .action(async (type, name, options) => {
      try {
        // Validate inputs
        if (!type || typeof type !== 'string') {
          throw new ValidationError('Generation type is required.', [
            'Valid types: module, event, dto, handler'
          ])
        }

        if (!name || typeof name !== 'string') {
          throw new ValidationError('Name is required.', [
            'Provide a valid name for the artifact'
          ])
        }

        if (!/^[a-zA-Z][a-zA-Z0-9-_]*$/.test(name)) {
          throw new ValidationError('Name contains invalid characters.', [
            'Name must start with a letter',
            'Can contain letters, numbers, hyphens (-) and underscores (_)'
          ])
        }

        await handleGenerate(type, name, options)
      } catch (error) {
        ErrorHandler.handle(error)
        process.exit(1)
      }
    })
}

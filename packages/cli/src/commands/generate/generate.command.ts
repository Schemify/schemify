import { Command } from 'commander'
import chalk from 'chalk'
import { handleGenerate } from '../../utils/generators/generate-handler.js'

export function registerGenerateCommand(program: Command) {
  program
    .command('generate <type> <name>')
    .alias('g')
    .description('Generate code artifacts (module, event, dto, etc.)')
    .option('-p, --path <path>', 'Base path to generate into', 'src/')
    .action(async (type, name, options) => {
      try {
        await handleGenerate(type, name, options)
      } catch (err: any) {
        console.error(chalk.red('❌ Error during generation:'), err.message)
      }
    })
}

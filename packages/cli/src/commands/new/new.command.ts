import { Command } from 'commander'
import {
  TemplateType,
  FrameworkType,
  PackageManagerType,
  CLIFlags
} from '@schemifyjs/types'
import { createNewCommand } from './new.factory.js'
import { parseEnum } from '../../utils/parse-enum.js'
import chalk from 'chalk'

export function registerNewCommand(program: Command) {
  const availableTemplates = Object.values(TemplateType)

  const newCmd = program
    .command('new')
    .description('Create a new project using a template')
    .showHelpAfterError()
    .argument(
      '[template]',
      `Project template (${availableTemplates.join(', ')})`
    )
    .option('-n, --name <name>', 'Project name')
    .option('-f, --framework <fw>', 'Framework to use (e.g. nestjs, express)')
    .option('-p, --pm <pm>', 'Package manager (npm, yarn, pnpm)')
    .action(async (template: string | undefined, flags: CLIFlags) => {
      if (!template) {
        console.error(chalk.red('❌ Missing required argument <template>.'))
        newCmd.help({ error: true })
      }

      const command = await createNewCommand(template as TemplateType, flags)
      await command.execute()
    })
  newCmd.addHelpText(
    'after',
    `\n${chalk.bold('Available Templates:')}
    ${availableTemplates.map((t) => `- ${chalk.yellow(t)}`).join('\n  ')}

Example:
  ${chalk.cyan('schemify new microservice')} --name my-api --framework nestjs --pm npm`
  )
}

import { CLIFlags, ProjectOptions, TemplateType } from '@schemifyjs/types'
import { askFramework, askPackageManager, askProjectName } from './prompts.js'
import { NewCommand } from './new.executor.js'

export async function createNewCommand(
  template: TemplateType,
  flags: CLIFlags
): Promise<NewCommand> {
  const name = flags.name ?? (await askProjectName())
  const framework = flags.framework ?? (await askFramework())
  const packageManager = flags.pm ?? (await askPackageManager())

  const options: ProjectOptions = {
    name,
    template,
    framework,
    packageManager
  }

  return new NewCommand(options)
}

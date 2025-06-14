import { ProjectOptions } from '@schemifyjs/types'
import { ProjectScaffolder } from '@schemifyjs/core'

export class NewCommand {
  constructor(private readonly options: ProjectOptions) {}

  async execute(): Promise<void> {
    const scaffolder = new ProjectScaffolder()
    await scaffolder.scaffold(this.options)
  }
}

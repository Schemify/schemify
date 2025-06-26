import { NewSchemify } from '@schemifyjs/types'
import { runNewCommand } from '@schemifyjs/core'

export class NewCommand {
  constructor(private readonly newSchemify: NewSchemify) {}

  async execute(): Promise<void> {
    // TODO: Add validation for the newSchemify object
    runNewCommand(this.newSchemify)
  }
}

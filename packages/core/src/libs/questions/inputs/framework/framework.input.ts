import { FrameworkType } from '@schemifyjs/types'
import { validateFramework } from './framework.validator.js'

export function frameworkQuestion() {
  return {
    type: 'select',
    name: 'framework',
    message: 'Which framework would you like to use?',
    choices: Object.values(FrameworkType),
    validate: validateFramework
  }
}

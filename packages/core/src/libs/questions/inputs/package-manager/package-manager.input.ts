import { PackageManagerType } from '@schemifyjs/types'
import { validatePackageManager } from './package-manager.validator.js'

export function packageManagerQuestion() {
  return {
    type: 'select',
    name: 'packageManager',
    message: 'Which package manager do you prefer?',
    choices: Object.values(PackageManagerType),
    validate: validatePackageManager
  }
}

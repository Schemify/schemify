import { FrameworkType, PackageManagerType } from '@schemifyjs/types'
import enquirer from 'enquirer'

export async function askFramework(): Promise<FrameworkType> {
  const { framework } = await enquirer.prompt<{ framework: FrameworkType }>({
    type: 'select',
    name: 'framework',
    message: 'Select the framework to use:',
    choices: Object.values(FrameworkType)
  })
  return framework
}

export async function askPackageManager(): Promise<PackageManagerType> {
  const { packageManager } = await enquirer.prompt<{
    packageManager: PackageManagerType
  }>({
    type: 'select',
    name: 'packageManager',
    message: 'Select the package manager to use:',
    choices: Object.values(PackageManagerType)
  })
  return packageManager
}

export async function askProjectName(): Promise<string> {
  const { projectName } = await enquirer.prompt<{ projectName: string }>({
    type: 'input',
    name: 'projectName',
    message: 'Enter the project name:',
    validate: (input) =>
      /^[a-z]([a-z0-9]*(-[a-z0-9]+)*)?$/.test(input) ||
      '❌ Invalid name. Use lowercase letters, numbers, and hyphens.'
  })
  return projectName
}

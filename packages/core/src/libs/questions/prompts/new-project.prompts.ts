import enquirer from 'enquirer'

import { FrameworkType, PackageManagerType } from '@schemifyjs/types'
import { frameworkQuestion } from '../inputs/framework/framework.input.js'
import { packageManagerQuestion } from '../inputs/package-manager/package-manager.input.js'
import { microserviceNameQuestion } from '../inputs/microservice-name/microservice-name.input.js'

export interface NewProjectPromptAnswers {
  name: string
  framework: FrameworkType
  packageManager: PackageManagerType
}

export async function askNewProjectQuestions(): Promise<NewProjectPromptAnswers> {
  const { prompt } = enquirer

  return await prompt<NewProjectPromptAnswers>([
    microserviceNameQuestion(),
    frameworkQuestion(),
    packageManagerQuestion()
  ])
}

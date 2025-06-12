import { ProjectScaffolder } from '@schemifyjs/core'

import {
  TemplateType,
  FrameworkType,
  PackageManagerType,
  type ProjectOptions
} from '@schemifyjs/types'

import chalk from 'chalk'
import enquirer from 'enquirer'

type Answers = {
  name: string
  pm: PackageManagerType
  framework: FrameworkType
}

const allowedTypes = Object.values(TemplateType) as readonly TemplateType[]

export const newCommand = async (type?: TemplateType) => {
  const { prompt } = enquirer

  if (!type) {
    console.error(chalk.red('❌ Debes indicar el tipo de proyecto.'))
    console.log(
      chalk.gray(`Ejemplo: schemify new ${TemplateType.Microservice}`)
    )
    process.exit(1)
  }

  if (!allowedTypes.includes(type)) {
    console.error(chalk.red(`❌ Tipo no soportado: "${type}"`))
    console.log(
      chalk.gray(
        `Tipos disponibles: ${allowedTypes.map((t) => `"${t}"`).join(', ')}`
      )
    )
    process.exit(1)
  }

  let answers: Answers

  try {
    answers = (await prompt<Answers>([
      {
        type: 'input',
        name: 'name',
        message: `Nombre del ${type}:`,
        initial: `my-${type}`,
        validate: (input) =>
          /^[a-z]([a-z0-9]*(-[a-z0-9]+)*)?$/.test(input)
            ? true
            : '❌ Nombre inválido. Usa minúsculas, números y guiones.'
      },
      {
        type: 'select',
        name: 'pm',
        message: '¿Gestor de paquetes?',
        choices: [
          { name: PackageManagerType.Npm, message: 'npm' },
          {
            name: PackageManagerType.Npm,
            message: 'yarn',
            disabled: '(próx.)'
          },
          {
            name: PackageManagerType.Npm,
            message: 'pnpm',
            disabled: '(próx.)'
          }
        ]
      },
      {
        type: 'select',
        name: 'framework',
        message: 'Framework:',
        choices: [
          { name: FrameworkType.NestJS, message: 'NestJS' },
          {
            name: FrameworkType.NestJS,
            message: 'ExpressJS',
            disabled: '(próx.)'
          }
        ]
      }
    ])) as Answers
  } catch {
    console.error(chalk.red('🚫 Ejecución cancelada'))
    process.exit(1)
  }

  const args: ProjectOptions = {
    name: answers.name,
    template: type,
    framework: answers.framework,
    packageManager: answers.pm
  }

  try {
    console.log(chalk.cyan(`✨ Creando proyecto "${args.name}"...`))

    const scaffolder = new ProjectScaffolder()

    await scaffolder.scaffold(args)

    console.log(chalk.green(`\n✅ Proyecto creado en ./${args.name}`))
    console.log(
      chalk.gray(
        `\n➡️  cd ${args.name}\n📦 ${args.packageManager} install\n🚀 ${args.packageManager} run start\n`
      )
    )
  } catch (err: any) {
    const msgs: Record<string, string> = {
      ENOENT: '❌ Comando no encontrado. ¿Está instalado?',
      ERR_INVALID_ARG_VALUE: '❌ Argumento inválido en el CLI.'
    }
    console.error(
      chalk.red(msgs[err.code] ?? err.message ?? 'Error desconocido')
    )
    process.exit(1)
  }
}

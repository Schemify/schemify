import chalk from 'chalk'
import { TemplateType } from '@schemifyjs/types'

export const showHelp = () => {
  console.log(
    chalk.bold.blue('Schemify CLI') +
      chalk.gray(' - herramientas para microservicios NestJS\n')
  )

  console.log(chalk.bold('Comandos disponibles:'))
  console.log(`  ${chalk.green('new')} <tipo>        Crea un nuevo proyecto`)
  console.log(`  ${chalk.green('--version')}         Muestra la versión actual`)
  console.log(`  ${chalk.green('--help')}            Muestra esta ayuda\n`)

  console.log(chalk.bold('Tipos de plantilla soportados:'))
  Object.values(TemplateType).forEach((type) =>
    console.log(`  - ${chalk.yellow(type)}`)
  )

  console.log(`\n${chalk.gray('Ejemplo:')}`)
  console.log(`  schemify new ${TemplateType.Microservice}`)
}

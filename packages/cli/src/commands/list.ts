import chalk from 'chalk'
import { TemplateType, FrameworkType } from '@schemifyjs/types'

export const listOptions = () => {
  console.log(chalk.bold('📦 Tipos de plantilla:'))
  Object.values(TemplateType).forEach((t) =>
    console.log(`- ${chalk.yellow(t)}`)
  )

  console.log(chalk.bold('\n🧱 Frameworks soportados:'))
  Object.values(FrameworkType).forEach((f) => console.log(`- ${chalk.cyan(f)}`))
}

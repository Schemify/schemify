import { execSync } from 'child_process'
import chalk from 'chalk'
import { version as localVersion } from './version.js'

const pkgName = '@schemifyjs/cli'

export const checkForUpdate = () => {
  try {
    const latest = execSync(`npm view ${pkgName} version`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore']
    }).trim()

    if (latest !== localVersion) {
      console.log(chalk.yellowBright(`⚠️  Schemify CLI está desactualizado!`))
      console.log(
        chalk.gray(
          `   Versión actual: ${localVersion} → Última: ${latest}\n   Ejecuta: ${chalk.cyan(
            `npm i -g ${pkgName}`
          )}\n`
        )
      )
    }
  } catch {
    // silencio si no hay red o NPM falla, no interrumpe UX
  }
}

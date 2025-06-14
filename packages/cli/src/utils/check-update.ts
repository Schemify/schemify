import { execSync } from 'child_process'
import chalk from 'chalk'
import { version as localVersion } from '../version.js'

const pkgName = '@schemifyjs/cli'

export const checkForUpdate = () => {
  try {
    const latest = execSync(`npm view ${pkgName} version`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore']
    }).trim()

    if (latest !== localVersion) {
      console.log(
        chalk.yellowBright(`⚠️  A new version of Schemify CLI is available!`)
      )
      console.log(
        chalk.gray(`   Current version: ${localVersion} → Latest: ${latest}`)
      )

      const pm = detectPackageManager()
      const installCmd = `${pm} install -g ${pkgName}`

      console.log(
        chalk.cyan(`\n💡 To upgrade, run:\n   ${chalk.bold(installCmd)}\n`)
      )
    }
  } catch {
    // fail silently if offline or npm fails
  }
}

function detectPackageManager(): 'npm' | 'yarn' | 'pnpm' {
  const userAgent = process.env.npm_config_user_agent || ''
  if (userAgent.includes('yarn')) return 'yarn'
  if (userAgent.includes('pnpm')) return 'pnpm'
  return 'npm'
}

import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'

export async function renameGitignore(targetDir: string): Promise<void> {
  const filePath = path.join(targetDir, 'gitignore')
  const newPath = path.join(targetDir, '.gitignore')
  if (await fs.pathExists(filePath)) {
    await fs.move(filePath, newPath, { overwrite: true })
    console.log(chalk.yellow('📝 Renamed gitignore → .gitignore'))
  }
}

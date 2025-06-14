import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'

export async function generateModule(name: string, basePath: string) {
  const moduleName = name.toLowerCase()
  const folder = path.join(basePath, moduleName)
  await fs.ensureDir(folder)

  const file = path.join(folder, `${moduleName}.module.ts`)
  const content = `export class ${capitalize(moduleName)}Module {}\n`

  await fs.writeFile(file, content)
  console.log(chalk.green(`✅ Module "${moduleName}" generated at ${folder}`))
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

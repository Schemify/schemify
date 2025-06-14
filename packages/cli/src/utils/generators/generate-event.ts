import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'

export async function generateEvent(name: string, basePath: string) {
  const pascalName = toPascalCase(name)
  const fileName = `${name.toLowerCase()}.event.ts`
  const folder = path.join(basePath, 'events')

  await fs.ensureDir(folder)

  const filePath = path.join(folder, fileName)
  const content = `export class ${pascalName}Event {
  constructor(
    // Add your event properties here
  ) {}
}
`

  await fs.writeFile(filePath, content)
  console.log(
    chalk.green(`✅ Event "${pascalName}Event" generated at ${filePath}`)
  )
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_ ]+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')
}

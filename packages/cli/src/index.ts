#!/usr/bin/env node

import chalk from 'chalk'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

import { checkForUpdate } from './check-update.js'
import { newCommand } from './commands/new.js'
import { showHelp } from './commands/help.js'
import { listOptions } from './commands/list.js'

import { TemplateType } from '@schemifyjs/types'

// 🧠 Embed version
const __dirname = dirname(fileURLToPath(import.meta.url))
const pkgPath = join(__dirname, '..', 'package.json')
const { version } = JSON.parse(readFileSync(pkgPath, 'utf-8'))

// 🚀 Check si hay versión más nueva
checkForUpdate()

// ⚡ Flags globales primero
if (process.argv.includes('-v') || process.argv.includes('--version')) {
  console.log(chalk.cyan(`Schemify CLI v${version}`))
  process.exit(0)
}

if (process.argv.includes('-h') || process.argv.includes('--help')) {
  showHelp()
  process.exit(0)
}

// 🧭 Comando + argumentos
const [, , cmd, arg] = process.argv

// 🗺️ Router de comandos
const commands: Record<string, () => void> = {
  new: () => newCommand(arg as TemplateType | undefined),
  help: showHelp,
  list: listOptions,
  '--help': showHelp,
  '-h': showHelp,
  version: () => console.log(chalk.cyan(`Schemify CLI v${version}`)),
  '--version': () => console.log(chalk.cyan(`Schemify CLI v${version}`)),
  '-v': () => console.log(chalk.cyan(`Schemify CLI v${version}`))
}

// 🚦 Ejecución
if (cmd in commands) {
  commands[cmd]()
} else {
  console.error(chalk.red(`❌ Comando desconocido: ${cmd ?? '(vacío)'}\n`))
  showHelp()
  process.exit(1)
}

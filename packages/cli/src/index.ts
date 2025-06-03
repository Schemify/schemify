#!/usr/bin/env node
import chalk from "chalk";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import { checkForUpdate } from "./check-update.js";
import { newCommand } from "./commands/new.js";

// 🧠 Embed version
const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgPath = join(__dirname, "..", "package.json");
const { version } = JSON.parse(readFileSync(pkgPath, "utf-8"));

// 🚀 Check si hay versión más nueva
checkForUpdate();

// 🧭 Comando + argumentos
const [, , cmd, ...args] = process.argv;

// 🗺️ Router de comandos
const commands: Record<string, () => void> = {
  new: () => newCommand(args[0]),
  help: showHelp,
  "--help": showHelp,
  "-h": showHelp,
  version: () => console.log(chalk.cyan(`Schemify CLI v${version}`)),
  "--version": () => console.log(chalk.cyan(`Schemify CLI v${version}`)),
  "-v": () => console.log(chalk.cyan(`Schemify CLI v${version}`)),
};

// 🧾 Ayuda
function showHelp() {
  console.log(
    chalk.bold.blue("Schemify CLI") +
      chalk.gray(" - herramientas para microservicios NestJS\n")
  );
  console.log(chalk.bold("Comandos disponibles:"));
  console.log(`  ${chalk.green("new")} <nombre>     Crea un nuevo proyecto`);
  console.log(`  ${chalk.green("--version")}         Muestra la versión`);
  console.log(`  ${chalk.green("--help")}            Muestra la ayuda\n`);
  console.log(chalk.gray("Ejemplo:"));
  console.log(`  schemify new mi-app\n`);
}

// 🚦 Ejecución
if (cmd in commands) {
  commands[cmd]();
} else {
  console.error(chalk.red(`❌ Comando desconocido: ${cmd ?? "(vacío)"}\n`));
  showHelp();
  process.exit(1);
}

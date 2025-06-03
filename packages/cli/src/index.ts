#!/usr/bin/env node
import { execSync } from "child_process";
import chalk from "chalk";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import { checkForUpdate } from "./check-update.js";

checkForUpdate();

// Obtener ruta al package.json (manteniendo soporte para ESM)
const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgPath = join(__dirname, "..", "package.json");
const { version } = JSON.parse(readFileSync(pkgPath, "utf-8"));

const [, , cmd, ...args] = process.argv;

const showHelp = () => {
  console.log(
    chalk.bold.blue("Schemify CLI") +
      chalk.gray(` - herramientas para microservicios NestJS\n`)
  );
  console.log(chalk.bold("Comandos disponibles:"));
  console.log(
    `  ${chalk.green("new")} <nombre>     Crea un nuevo proyecto NestJS`
  );
  console.log(`  ${chalk.green("help")}             Muestra esta ayuda`);
  console.log(
    `  ${chalk.green("--version")}         Muestra la versión actual`
  );
  console.log(`  ${chalk.green("--help")}            Alias de ayuda\n`);
  console.log(chalk.gray("Ejemplo:"));
  console.log(`  schemify new mi-app\n`);
};

switch (cmd) {
  case "new": {
    const name = args[0];
    if (!name) {
      console.error(chalk.red("❌ Debes indicar un nombre para el proyecto"));
      process.exit(1);
    }
    execSync(`npx nest new ${name}`, { stdio: "inherit" });
    break;
  }

  case "help":
  case "--help":
  case "-h":
  case undefined:
    showHelp();
    break;

  case "--version":
  case "-v":
  case "version":
    console.log(chalk.cyan(`Schemify CLI v${version}`));
    break;

  default:
    console.error(chalk.red(`❌ Comando desconocido: ${cmd}\n`));
    showHelp();
    process.exit(1);
}

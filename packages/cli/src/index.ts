#!/usr/bin/env node
import { execSync } from "child_process";
import chalk from "chalk";

const [, , cmd, ...args] = process.argv;

const showHelp = () => {
  console.log(
    chalk.bold.blue("Schemify CLI") +
      chalk.gray(" - herramientas para microservicios NestJS")
  );
  console.log();
  console.log(chalk.bold("Comandos disponibles:"));
  console.log(
    `  ${chalk.green("new")} <nombre>    Crea un nuevo proyecto usando NestJS`
  );
  console.log(`  ${chalk.green("help")}           Muestra esta ayuda`);
  console.log();
  console.log(chalk.gray("Ejemplo:"));
  console.log(`  schemify new mi-app`);
  console.log();
};

switch (cmd) {
  case "new":
    const name = args[0];
    if (!name) {
      console.error(chalk.red("❌ Debes indicar un nombre para el proyecto"));
      process.exit(1);
    }
    execSync(`npx nest new ${name}`, { stdio: "inherit" });
    break;

  case "help":
  case "--help":
  case "-h":
  case undefined:
    showHelp();
    break;

  default:
    console.error(chalk.red(`❌ Comando desconocido: ${cmd}`));
    showHelp();
    process.exit(1);
}

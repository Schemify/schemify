import { execSync } from "child_process";
import chalk from "chalk";
import enquirer from "enquirer";

export const newCommand = async (name?: string) => {
  const { prompt } = enquirer;

  if (!name) {
    console.error(chalk.red("❌ Debes indicar un nombre para el proyecto"));
    console.log(chalk.gray("Ejemplo: schemify new mi-proyecto"));
    process.exit(1);
  }

  let answers: { pm: string; framework: string };
  try {
    answers = await prompt([
      {
        type: "select",
        name: "pm",
        message: "¿Gestor de paquetes?",
        choices: [
          { name: "npm", message: "npm" },
          { name: "yarn", disabled: "(proximamente)" },
          { name: "pnpm", disabled: "(proximamente)" },
        ],
      },
      {
        type: "select",
        name: "framework",
        message: "¿Qué framework quieres usar?",
        choices: [
          { name: "nestjs", message: "NestJS" },
          { name: "express", message: "ExpressJS", disabled: "(proximamente)" },
        ],
      },
    ]);
  } catch {
    console.error(chalk.red("🚫 Instalación cancelada"));
    process.exit(1);
  }

  const { framework, pm } = answers;

  try {
    console.log(
      chalk.cyan(`✨ Creando proyecto "${name}" con ${framework}...`)
    );
    execSync(`npx ${framework} new ${name} --package-manager=${pm}`, {
      stdio: "inherit",
    });
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException;

    const handlers: Record<string, () => void> = {
      ENOENT: () =>
        console.error(chalk.red("❌ Comando no encontrado. ¿Está instalado?")),
      ERR_INVALID_ARG_VALUE: () =>
        console.error(chalk.red("❌ Argumento inválido en el CLI.")),
    };

    const handler =
      handlers[err.code ?? ""] ??
      (() => {
        console.error(chalk.red("❌ Error desconocido."));
        if (err?.message) console.error(err.message);
      });

    handler();
    process.exit(1);
  }
};

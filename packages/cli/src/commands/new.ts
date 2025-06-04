import { execSync } from "child_process";
import chalk from "chalk";
import enquirer from "enquirer";

const allowedTypes = ["microservice", "kafka", "graphql", "grpc"];

export const newCommand = async (type?: string) => {
  const { prompt } = enquirer;

  if (!type) {
    console.error(chalk.red("❌ Debes indicar el tipo de proyecto."));
    console.log(chalk.gray("Ejemplo: schemify new kafka"));
    process.exit(1);
  }

  if (!allowedTypes.includes(type)) {
    console.error(chalk.red(`❌ Tipo no soportado: "${type}"`));
    console.log(
      chalk.gray(
        `Tipos disponibles: ${allowedTypes.map((t) => `"${t}"`).join(", ")}`
      )
    );
    process.exit(1);
  }

  let answers: { name: string; pm: string; framework: string };

  try {
    answers = await prompt([
      {
        type: "input",
        name: "name",
        message: `Nombre del ${type}:`,
        initial: `my-${type}`,
        validate: (input: string) =>
          /^[a-z]([a-z0-9]*(-[a-z0-9]+)*)?$/.test(input)
            ? true
            : "❌ Nombre inválido. Usa minúsculas, números y guiones (ej: my-service).",
      },
      {
        type: "select",
        name: "pm",
        message: "¿Gestor de paquetes?",
        choices: [
          { name: "npm", message: "npm" },
          { name: "yarn", disabled: "(próximamente)" },
          { name: "pnpm", disabled: "(próximamente)" },
        ],
      },
      {
        type: "select",
        name: "framework",
        message: "¿Qué framework quieres usar?",
        choices: [
          { name: "nestjs", message: "NestJS" },
          { name: "express", message: "ExpressJS", disabled: "(próximamente)" },
        ],
      },
    ]);
  } catch {
    console.error(chalk.red("🚫 Ejecución cancelada"));
    process.exit(1);
  }

  const { name, framework, pm } = answers;

  try {
    console.log(
      chalk.cyan(`✨ Creando proyecto "${name}" con ${framework}...`)
    );
    execSync(`npx ${framework} new ${name} --package-manager=${pm}`, {
      stdio: "inherit",
    });

    console.log(chalk.green(`\n✅ Proyecto creado en ./${name}`));
    console.log(
      chalk.gray(`\n➡️  cd ${name}\n📦 ${pm} install\n🚀 ${pm} run start\n`)
    );
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

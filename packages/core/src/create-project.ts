import path from "path";

import { execa } from "execa";

import { copyTemplate } from "./utils/copy-template.js";
import { replacePlaceholders } from "./utils/replace-placeholders.js";
import { verifyNoPlaceholders } from "./utils/verify-no-placeholders.js";
import { type ProjectOptions } from "@schemifyjs/types";

export async function createProject(options: ProjectOptions) {
  const projectPath = path.resolve(options.name);

  // 📦 Copia directa al nombre final (ej: my-microservice/)
  await copyTemplate(options);

  const replacements = generateNameVariants(options.name);
  replacePlaceholders(projectPath, replacements);

  await verifyNoPlaceholders(projectPath);

  await execa("npm", ["install"], { cwd: projectPath, stdio: "inherit" });

  // if (options.initializeGit) await initGit(projectPath);
  // if (options.installDeps) await installDependencies(projectPath, options.packageManager);
}

function generateNameVariants(name: string): Record<string, string> {
  const camel = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  const pascal = camel.charAt(0).toUpperCase() + camel.slice(1);
  const snake = name.replace(/-/g, "_");
  const screamingSnake = snake.toUpperCase();

  return {
    projectName: name,
    projectNameCamel: camel, // example: myMicroservice
    ProjectName: pascal, // example: MyMicroservice
    project_name: snake,
    PROJECT_NAME: screamingSnake,
  };
}

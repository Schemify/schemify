import path from "path";
import fs from "fs-extra";

import { copyTemplate } from "./utils/copy-template.js";
import { replacePlaceholders } from "./utils/replace-placeholders.js";
import { verifyNoPlaceholders } from "./utils/verify-no-placeholders.js";

import { ProjectOptions } from "@schemifyjs/types";

export async function createProject(options: ProjectOptions) {
  const projectPath = path.resolve(options.name);

  await copyTemplate(options);

  await fs.rename(
    path.join(projectPath, "apps", "schemify-microservice"),
    path.join(projectPath, "apps", options.name)
  );

  await replacePlaceholders(projectPath, {
    name: options.name,
    description: "Proyecto generado con Schemify",
    author: "Tu Nombre",
  });

  await verifyNoPlaceholders(projectPath);

  // if (options.initializeGit) { await initGit(projectPath); }
  // if (options.installDeps) { await installDependencies(projectPath, options.packageManager); }
}

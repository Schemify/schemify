import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

import { type ProjectOptions } from "@schemifyjs/types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function copyTemplate(options: ProjectOptions) {
  const templatePath = path.resolve(
    __dirname,
    "..",
    "templates",
    options.template,
    options.framework,
    options.packageManager
  );

  if (!(await fs.pathExists(templatePath))) {
    throw new Error(
      `Plantilla "${options.template}" no encontrada en ${templatePath}`
    );
  }

  const projectRoot = path.resolve(options.name); // carpeta final donde se crea

  await fs.copy(templatePath, projectRoot, {
    overwrite: true,
    errorOnExist: false,
    filter: (src) => {
      const basename = path.basename(src);
      return !["node_modules", "dist", ".DS_Store"].includes(basename);
    },
  });

  console.log(`📁 Proyecto "${options.name}" creado en ${projectRoot}`);

  try {
    const gitignorePath = path.join(projectRoot, "gitignore");
    const dotGitignorePath = path.join(projectRoot, ".gitignore");

    if (await fs.pathExists(gitignorePath)) {
      await fs.move(gitignorePath, dotGitignorePath, { overwrite: true });
    }
  } catch (err: any) {
    console.warn("⚠️ No se pudo mover gitignore:", err.message);
  }
}

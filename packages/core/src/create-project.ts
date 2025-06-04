import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { execSync } from "child_process";

/**
 * Crea un nuevo proyecto desde una plantilla base.
 */
export async function createProject({
  type,
  name,
  framework,
  packageManager,
}: {
  type: string;
  name: string;
  framework: string;
  packageManager: string;
}): Promise<void> {
  const templateDir = path.resolve(__dirname, "..", "templates", type);
  const targetDir = path.resolve(process.cwd(), name);

  if (!fs.existsSync(templateDir)) {
    throw new Error(`No se encontró la plantilla para: ${type}`);
  }

  await fs.copy(templateDir, targetDir);

  // Reemplazo de placeholders en archivos de texto comunes
  const files = await fs.readdir(targetDir);
  for (const file of files) {
    const fullPath = path.join(targetDir, file);
    const stat = await fs.stat(fullPath);
    if (stat.isFile()) {
      let content = await fs.readFile(fullPath, "utf8");
      content = content.replace(/__PROJECT_NAME__/g, name);
      await fs.writeFile(fullPath, content);
    }
  }

  // Inicializar repo Git (opcional)
  try {
    execSync("git init", { cwd: targetDir, stdio: "ignore" });
  } catch {
    console.log(chalk.yellow("⚠️  No se pudo inicializar Git."));
  }

  // Instalar dependencias
  try {
    execSync(`${packageManager} install`, {
      cwd: targetDir,
      stdio: "inherit",
    });
  } catch {
    console.log(chalk.yellow("⚠️  No se pudieron instalar dependencias."));
  }

  console.log(chalk.green(`✅ Proyecto creado en ./${name}`));
}

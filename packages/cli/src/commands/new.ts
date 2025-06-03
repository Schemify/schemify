import fs from "fs";
import path from "path";

export function handleNewCommand(projectName: string) {
  const targetPath = path.join(process.cwd(), projectName);

  if (fs.existsSync(targetPath)) {
    console.error(`❌ El proyecto "${projectName}" ya existe.`);
    process.exit(1);
  }

  fs.mkdirSync(targetPath);
  fs.writeFileSync(
    path.join(targetPath, "index.ts"),
    `console.log('Bienvenido a ${projectName}');`
  );

  console.log(`✅ Proyecto "${projectName}" creado con éxito.`);
}

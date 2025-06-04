export interface CreateProjectOptions {
  name: string;
  type: "microservice" | "grpc" | "kafka";
  path: string; // destino absoluto
  packageManager: "npm" | "yarn" | "pnpm";
  initializeGit?: boolean;
  installDeps?: boolean;
}

export async function createProject(options: CreateProjectOptions) {
  console.log("Creando proyecto", options.name);
  // 1. Validar inputs
  // 2. Localizar template
  // 3. Copiar archivos
  // 4. Reemplazar {{projectName}}, etc.
  // 5. Ejecutar comandos post-setup
}

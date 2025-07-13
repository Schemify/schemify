export function generateNameVariants(
  raw: string,
  prefix: string
): Record<string, string> {
  const normalized = raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const camel = normalized.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())
  const pascal = camel.charAt(0).toUpperCase() + camel.slice(1)
  const snake = normalized.replace(/-/g, '_')
  const screamingSnake = snake.toUpperCase()

  return {
    // Si prefix = "project" y normalized = "my-service"
    [`${prefix}_kebab`]: normalized, // project_kebab: "my-service"
    [`${prefix}_camel`]: camel, // project_camel: "myService"
    [`${prefix}_pascal`]: pascal, // project_pascal: "MyService"
    [`${prefix}_snake`]: snake, // project_snake: "my_service"
    [`${prefix}_screaming`]: screamingSnake // project_screaming: "MY_SERVICE"
  }
}

// export function generateNameVariants(raw: string): Record<string, string> {
//   const normalized = raw
//     .normalize('NFD')
//     .replace(/[\u0300-\u036f]/g, '')
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, '-')
//     .replace(/^-+|-+$/g, '')

//   const camel = normalized.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())
//   const pascal = camel.charAt(0).toUpperCase() + camel.slice(1)
//   const snake = normalized.replace(/-/g, '_')
//   const screamingSnake = snake.toUpperCase()

//   return {
//     project_name_kebab: normalized, // ejemplo: mi-proyecto-ejemplo
//     project_name_camel: camel, // ejemplo: miProyectoEjemplo
//     project_name_pascal: pascal, // ejemplo: MiProyectoEjemplo
//     project_name_snake: snake, // ejemplo: mi_proyecto_ejemplo
//     project_name_screaming: screamingSnake // ejemplo: MI_PROYECTO_EJEMPLO
//   }
// }

export function generateNameVariants(raw: string): Record<string, string> {
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
    project_name_kebab: normalized,
    project_name_camel: camel,
    project_name_pascal: pascal,
    project_name_snake: snake,
    project_name_screaming: screamingSnake
  }
}

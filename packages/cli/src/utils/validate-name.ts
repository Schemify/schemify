export function validateName(name: string): string {
  const isValid = /^[a-z]([a-z0-9]*(-[a-z0-9]+)*)?$/.test(name)
  if (!isValid) {
    throw new Error(
      '❌ Invalid project name. Use lowercase letters, numbers, and dashes.'
    )
  }
  return name
}

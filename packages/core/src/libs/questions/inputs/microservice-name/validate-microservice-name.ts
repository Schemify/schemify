export function validateName(value: string): true | string {
  const regex = /^[a-z][a-z0-9\-]*$/

  if (!value || typeof value !== 'string') {
    return 'Name is required and must be a string.'
  }

  if (!regex.test(value)) {
    return 'Use only lowercase letters, numbers, and hyphens. Start with a letter.'
  }

  return true
}

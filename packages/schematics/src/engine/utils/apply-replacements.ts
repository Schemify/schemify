export function applyReplacements(
  input: string,
  replacements: Record<string, string>
): string {
  let result = input

  for (const [key, val] of Object.entries(replacements)) {
    const patterns = [
      new RegExp(`__${key}__`, 'g'),
      new RegExp(`{{${key}}}`, 'g')
    ]
    for (const pattern of patterns) {
      result = result.replace(pattern, val)
    }
  }

  return result
}

export function parseEnum<T>(enumType: Record<string, T>, label: string) {
  return (value: string): T => {
    const enumValues = Object.values(enumType)
    if (!enumValues.includes(value as unknown as T)) {
      throw new Error(
        `❌ "${value}" is not a valid ${label}. Allowed values: ${enumValues.join(', ')}`
      )
    }
    return value as unknown as T
  }
}

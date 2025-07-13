export class NameValidator {
  // Regla: minúsculas, números, guiones. No puede comenzar con número o guion
  static NAME_REGEX = /^[a-z][a-z0-9\-]{1,}$/

  static validate(name: string): void {
    if (!name || typeof name !== 'string') {
      throw new Error(`Name is required and must be a string.`)
    }

    if (!this.NAME_REGEX.test(name)) {
      throw new Error(
        `Invalid name "${name}". Use only lowercase letters, numbers, and hyphens. Must start with a letter.`
      )
    }
  }
}

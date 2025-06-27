import { ValidationError } from '../../utils/error-handler.js'

export function ensureProjectNameProvided(name?: string): void {
  if (!name) {
    throw new ValidationError('You must specify a project name.', [
      'Example: schemify new my-project',
      'The name must be valid for a project directory'
    ])
  }
}

export function validateCliProjectName(name: string): void {
  if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
    throw new ValidationError('The project name contains invalid characters.', [
      'Use only letters, numbers, hyphens (-) and underscores (_)',
      'Example: schemify new my-project-123'
    ])
  }
}

import { ValidationError } from '../../utils/error-handler.js'

export function validateGenerateInputs(type: string, name: string) {
  if (!type || typeof type !== 'string') {
    throw new ValidationError('Generation type is required.', [
      'Valid types: module, event, dto, handler'
    ])
  }

  if (!name || typeof name !== 'string') {
    throw new ValidationError('Name is required.', [
      'Provide a valid name for the artifact'
    ])
  }

  if (!/^[a-zA-Z][a-zA-Z0-9-_]*$/.test(name)) {
    throw new ValidationError('Name contains invalid characters.', [
      'Name must start with a letter',
      'Can contain letters, numbers, hyphens (-) and underscores (_)'
    ])
  }
}

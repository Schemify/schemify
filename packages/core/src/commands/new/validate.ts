export function validateNewProjectName(name: string): void {
  if (!name || typeof name !== 'string') {
    throw new Error('El nombre del proyecto es requerido y debe ser un string.')
  }
  if (name.length < 1) {
    throw new Error('El nombre del proyecto no puede estar vacío.')
  }
  if (name.length > 50) {
    throw new Error(
      'El nombre del proyecto es demasiado largo (máx 50 caracteres).'
    )
  }
  if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
    throw new Error(
      'El nombre del proyecto contiene caracteres inválidos. Usa solo letras, números, guiones (-) y guiones bajos (_).'
    )
  }
}

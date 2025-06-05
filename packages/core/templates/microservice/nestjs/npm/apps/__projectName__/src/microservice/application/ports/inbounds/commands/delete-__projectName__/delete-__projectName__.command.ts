/**
 * Delete__ProjectName__Command
 * -----------------------------------------------------------------------------
 * Comando que solicita la eliminación de un `__ProjectName__Entity` por su ID.
 *
 * Este comando es manejado por `Delete__ProjectName__Handler`, quien verifica la existencia
 * del agregado y delega la eliminación al repositorio de escritura.
 *
 * 🔐 Importante: este comando solo identifica el recurso a eliminar.
 * Cualquier lógica de autorización, validación cruzada o soft delete debería
 * resolverse dentro del handler o del repositorio.
 */

import { ICommand } from '@nestjs/cqrs'

export class Delete__ProjectName__Command implements ICommand {
  constructor(
    /**
     * ID del `__ProjectName__Entity` a eliminar.
     */
    public readonly id: string
  ) {}
}

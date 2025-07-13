/**
 * DeleteMicroserviceNameCommand
 * -----------------------------------------------------------------------------
 * Comando que solicita la eliminación de un `MicroserviceNameEntity` por su ID.
 *
 * Este comando es manejado por `DeleteMicroserviceNameHandler`, quien verifica la existencia
 * del agregado y delega la eliminación al repositorio de escritura.
 *
 * 🔐 Importante: este comando solo identifica el recurso a eliminar.
 * Cualquier lógica de autorización, validación cruzada o soft delete debería
 * resolverse dentro del handler o del repositorio.
 */

import { ICommand } from '@nestjs/cqrs'

export class DeleteMicroserviceNameCommand implements ICommand {
  constructor(
    /**
     * ID del `MicroserviceNameEntity` a eliminar.
     */
    public readonly id: string
  ) {}
}

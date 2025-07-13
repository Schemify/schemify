/**
 * CreateMicroserviceNameHandler
 * -----------------------------------------------------------------------------
 * Handler que responde al comando `CreateMicroserviceNameCommand`.
 *
 * Se encarga de:
 * - Instanciar un nuevo `MicroserviceNameEntity` desde los datos del comando
 * - Validar automáticamente usando los ValueObjects del dominio
 * - Persistir el nuevo agregado mediante el repositorio de escritura
 * - Aplicar el evento `MicroserviceNameCreatedEvent`
 *
 * Esta clase forma parte de la **capa de aplicación**, implementando el patrón **CQRS**.
 *
 * Flujo de ejecución:
 * 1. El microserviceName o servicio envía `CreateMicroserviceNameCommand` al `CommandBus`
 * 2. NestJS ejecuta este handler
 * 3. Se crea un nuevo `MicroserviceNameEntity` con sus reglas de dominio
 * 4. El handler invoca `createMicroserviceNamePort.create(...)`
 * 5. Se aplica el evento de creación (`entity.commit()`)
 * 6. Se retorna la entidad (puede ser transformada antes de exponerse)
 *
 * Dependencias:
 * - `CreateMicroserviceNamePort`: capa de persistencia orientada a escritura
 */

import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'

import { CreateMicroserviceNameCommand } from './create-microservice-name.command'

import { MicroserviceNameEntity } from '@microserviceName/microservice//domain/entities/microservice-name.entity'

import { CreateMicroserviceNamePort } from '@microserviceName/microservice/application/ports/outbounds/repositories/microservice-name-command-ports'

@CommandHandler(CreateMicroserviceNameCommand)
export class CreateMicroserviceNameHandler
  implements ICommandHandler<CreateMicroserviceNameCommand>
{
  constructor(
    @Inject(CreateMicroserviceNamePort)
    private readonly createMicroserviceNamePort: CreateMicroserviceNamePort,
    private readonly publisher: EventPublisher
  ) {}

  /**
   * Ejecuta el comando creando un nuevo agregado en el dominio.
   *
   * @param command Datos del nuevo ejemplo
   * @returns Instancia del agregado `MicroserviceNameEntity` creado
   */
  async execute(
    command: CreateMicroserviceNameCommand
  ): Promise<MicroserviceNameEntity> {
    const entity = MicroserviceNameEntity.create({
      name: command.name,
      description: command.description
    })

    const merged = this.publisher.mergeObjectContext(entity)
    await this.createMicroserviceNamePort.create(merged)
    merged.commit()

    return entity
  }
}

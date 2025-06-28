/**
 * Create__project_name_pascal__Handler
 * -----------------------------------------------------------------------------
 * Handler que responde al comando `Create__project_name_pascal__Command`.
 *
 * Se encarga de:
 * - Instanciar un nuevo `__project_name_pascal__Entity` desde los datos del comando
 * - Validar automáticamente usando los ValueObjects del dominio
 * - Persistir el nuevo agregado mediante el repositorio de escritura
 * - Aplicar el evento `__project_name_pascal__CreatedEvent`
 *
 * Esta clase forma parte de la **capa de aplicación**, implementando el patrón **CQRS**.
 *
 * Flujo de ejecución:
 * 1. El __project_name_camel__ o servicio envía `Create__project_name_pascal__Command` al `CommandBus`
 * 2. NestJS ejecuta este handler
 * 3. Se crea un nuevo `__project_name_pascal__Entity` con sus reglas de dominio
 * 4. El handler invoca `create__project_name_pascal__Port.create(...)`
 * 5. Se aplica el evento de creación (`entity.commit()`)
 * 6. Se retorna la entidad (puede ser transformada antes de exponerse)
 *
 * Dependencias:
 * - `Create__project_name_pascal__Port`: capa de persistencia orientada a escritura
 */

import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'

import { Create__project_name_pascal__Command } from './create-__project_name_camel__.command'

import { __project_name_pascal__Entity } from '@__project_name_camel__/microservice//domain/entities/__project_name_camel__.entity'

import { Create__project_name_pascal__Port } from '@__project_name_camel__/microservice/application/ports/outbounds/repositories/__project_name_camel__-command-ports'

@CommandHandler(Create__project_name_pascal__Command)
export class Create__project_name_pascal__Handler
  implements ICommandHandler<Create__project_name_pascal__Command>
{
  constructor(
    @Inject(Create__project_name_pascal__Port)
    private readonly create__project_name_pascal__Port: Create__project_name_pascal__Port,
    private readonly publisher: EventPublisher
  ) {}

  /**
   * Ejecuta el comando creando un nuevo agregado en el dominio.
   *
   * @param command Datos del nuevo ejemplo
   * @returns Instancia del agregado `__project_name_pascal__Entity` creado
   */
  async execute(
    command: Create__project_name_pascal__Command
  ): Promise<__project_name_pascal__Entity> {
    const entity = __project_name_pascal__Entity.create({
      name: command.name,
      description: command.description
    })

    const merged = this.publisher.mergeObjectContext(entity)
    await this.create__project_name_pascal__Port.create(merged)
    merged.commit()

    return entity
  }
}

import { Controller } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { __project_name_snake__ } from '@proto'

import { Delete__project_name_pascal__Command } from 'apps/__project_name_kebab__/src/microservice/application/ports/inbounds/commands'

@Controller()
export class Delete__project_name_camel__GrpcController {
  constructor(private readonly commandBus: CommandBus) {}

  @GrpcMethod('__project_name_camel__Service', 'delete__project_name_camel__')
  async delete__project_name_camel__(
    request: __project_name_snake__.Get__project_name_pascal__ByIdDto
  ): Promise<__project_name_snake__.__project_name_pascal__Empty> {
    const command = new Delete__project_name_pascal__Command(request.id)
    await this.commandBus.execute(command)

    return {}
  }
}

import { Controller } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { microservice_name } from '@proto'

import { DeleteMicroserviceNameCommand } from '@microserviceName/microservice/application/ports/inbounds/commands'

@Controller()
export class DeleteMicroserviceNameGrpcController {
  constructor(private readonly commandBus: CommandBus) {}

  @GrpcMethod('MicroserviceNameService', 'deleteMicroserviceName')
  async deleteMicroserviceName(
    request: microservice_name.GetMicroserviceNameByIdDto
  ): Promise<microservice_name.MicroserviceNameEmpty> {
    const command = new DeleteMicroserviceNameCommand(request.id)
    await this.commandBus.execute(command)

    return {}
  }
}

import { PrintMicroserviceNameInfoUseCase } from './print-microserviceName-info.use-case'
import { MicroserviceNameCreatedEvent } from '@microserviceName/microservice/domain/events/microserviceName-created.event'
import { MicroserviceNameCreatedPublisherPort } from '@microserviceName/microservice/application/ports/outbounds/messaging/microserviceName-created-publisher.port'
import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microserviceName.entity'

describe('PrintMicroserviceNameInfoUseCase', () => {
  let useCase: PrintMicroserviceNameInfoUseCase
  let publisher: jest.Mocked<MicroserviceNameCreatedPublisherPort>
  let publishMock: jest.Mock

  beforeEach(() => {
    publishMock = jest.fn()
    publisher = { publish: publishMock } as any
    useCase = new PrintMicroserviceNameInfoUseCase(publisher)
  })

  it('should call publisher.publish with the event', async () => {
    const entity = MicroserviceNameEntity.create({ name: 'Test' })
    const event = new MicroserviceNameCreatedEvent(entity)
    publishMock.mockResolvedValue(undefined)

    await useCase.execute(event)

    expect(publishMock).toHaveBeenCalledTimes(1)
    expect(publishMock).toHaveBeenCalledWith(event)
  })

  it('should propagate errors from the publisher', async () => {
    const entity = MicroserviceNameEntity.create({ name: 'Test' })
    const event = new MicroserviceNameCreatedEvent(entity)
    const error = new Error('Kafka error')
    publishMock.mockRejectedValue(error)

    await expect(useCase.execute(event)).rejects.toThrow('Kafka error')
  })
})

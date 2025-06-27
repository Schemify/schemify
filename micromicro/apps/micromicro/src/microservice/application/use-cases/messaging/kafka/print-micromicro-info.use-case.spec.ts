import { PrintMicromicroInfoUseCase } from './print-micromicro-info.use-case'
import { MicromicroCreatedEvent } from '@micromicro/microservice/domain/events/micromicro-created.event'
import { MicromicroCreatedPublisherPort } from '@micromicro/microservice/application/ports/outbounds/messaging/micromicro-created-publisher.port'
import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'

describe('PrintMicromicroInfoUseCase', () => {
  let useCase: PrintMicromicroInfoUseCase
  let publisher: jest.Mocked<MicromicroCreatedPublisherPort>
  let publishMock: jest.Mock

  beforeEach(() => {
    publishMock = jest.fn()
    publisher = { publish: publishMock } as any
    useCase = new PrintMicromicroInfoUseCase(publisher)
  })

  it('should call publisher.publish with the event', async () => {
    const entity = MicromicroEntity.create({ name: 'Test' })
    const event = new MicromicroCreatedEvent(entity)
    publishMock.mockResolvedValue(undefined)

    await useCase.execute(event)

    expect(publishMock).toHaveBeenCalledTimes(1)
    expect(publishMock).toHaveBeenCalledWith(event)
  })

  it('should propagate errors from the publisher', async () => {
    const entity = MicromicroEntity.create({ name: 'Test' })
    const event = new MicromicroCreatedEvent(entity)
    const error = new Error('Kafka error')
    publishMock.mockRejectedValue(error)

    await expect(useCase.execute(event)).rejects.toThrow('Kafka error')
  })
})

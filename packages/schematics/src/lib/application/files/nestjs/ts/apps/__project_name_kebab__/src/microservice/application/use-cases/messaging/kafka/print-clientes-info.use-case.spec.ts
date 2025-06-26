import { Print__project_name_pascal__InfoUseCase } from './print-__project_name_kebab__-info.use-case'
import { __project_name_pascal__CreatedEvent } from '@__project_name_kebab__/microservice/domain/events/__project_name_kebab__-created.event'
import { __project_name_pascal__CreatedPublisherPort } from '@__project_name_kebab__/microservice/application/ports/outbounds/messaging/__project_name_kebab__-created-publisher.port'
import { __project_name_pascal__Entity } from '@__project_name_kebab__/microservice/domain/entities/__project_name_kebab__.entity'

describe('Print__project_name_pascal__InfoUseCase', () => {
  let useCase: Print__project_name_pascal__InfoUseCase
  let publisher: jest.Mocked<__project_name_pascal__CreatedPublisherPort>
  let publishMock: jest.Mock

  beforeEach(() => {
    publishMock = jest.fn()
    publisher = { publish: publishMock } as any
    useCase = new Print__project_name_pascal__InfoUseCase(publisher)
  })

  it('should call publisher.publish with the event', async () => {
    const entity = __project_name_pascal__Entity.create({ name: 'Test' })
    const event = new __project_name_pascal__CreatedEvent(entity)
    publishMock.mockResolvedValue(undefined)

    await useCase.execute(event)

    expect(publishMock).toHaveBeenCalledTimes(1)
    expect(publishMock).toHaveBeenCalledWith(event)
  })

  it('should propagate errors from the publisher', async () => {
    const entity = __project_name_pascal__Entity.create({ name: 'Test' })
    const event = new __project_name_pascal__CreatedEvent(entity)
    const error = new Error('Kafka error')
    publishMock.mockRejectedValue(error)

    await expect(useCase.execute(event)).rejects.toThrow('Kafka error')
  })
})

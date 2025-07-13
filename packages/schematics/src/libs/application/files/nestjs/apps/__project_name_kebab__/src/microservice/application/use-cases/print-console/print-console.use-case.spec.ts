import { Print__project_name_camel__InfoUseCase } from './print__project_name_kebab__-info.use-case'
import { __project_name_camel__CreatedEvent } from 'apps/__project_name_kebab__/src/microservice/domain/events/__project_name_kebab__-created.event'
import { __project_name_camel__CreatedPublisherPort } from 'apps/__project_name_kebab__/src/microservice/application/ports/outbounds/messaging/__project_name_kebab__-created-publisher.port'
import { __project_name_camel__Entity } from '@__project_name_camel__/microservice/domain/entities/__project_name_camel__.entity'

describe('Print__project_name_camel__InfoUseCase', () => {
  let useCase: Print__project_name_camel__InfoUseCase
  let publisher: jest.Mocked<__project_name_camel__CreatedPublisherPort>
  let publishMock: jest.Mock

  beforeEach(() => {
    publishMock = jest.fn()
    publisher = { publish: publishMock } as any
    useCase = new Print__project_name_camel__InfoUseCase(publisher)
  })

  it('should call publisher.publish with the event', async () => {
    const entity = __project_name_camel__Entity.create({ name: 'Test' })
    const event = new __project_name_camel__CreatedEvent(entity)
    publishMock.mockResolvedValue(undefined)

    await useCase.execute(event)

    expect(publishMock).toHaveBeenCalledTimes(1)
    expect(publishMock).toHaveBeenCalledWith(event)
  })

  it('should propagate errors from the publisher', async () => {
    const entity = __project_name_camel__Entity.create({ name: 'Test' })
    const event = new __project_name_camel__CreatedEvent(entity)
    const error = new Error('Kafka error')
    publishMock.mockRejectedValue(error)

    await expect(useCase.execute(event)).rejects.toThrow('Kafka error')
  })
})

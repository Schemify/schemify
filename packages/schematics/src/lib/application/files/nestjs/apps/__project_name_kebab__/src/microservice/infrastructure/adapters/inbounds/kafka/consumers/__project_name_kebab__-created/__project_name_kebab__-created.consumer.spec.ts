import { Test, TestingModule } from '@nestjs/testing'
import { QueryBus } from '@nestjs/cqrs'

import { __project_name_pascal__CreatedConsumer } from './__project_name_camel__-created.consumer'
import { Envelope } from '@__project_name_camel__/libs/shared/events/event-envelope'
import { __project_name_pascal__CreatedEvent } from '@__project_name_camel__/microservice/domain/events/__project_name_camel__-created.event'
import { Get__project_name_pascal__ByIdQuery } from '@__project_name_camel__/microservice/application/ports/inbounds/queries'

describe('__project_name_pascal__CreatedConsumer', () => {
  let consumer: __project_name_pascal__CreatedConsumer
  let queryBus: jest.Mocked<QueryBus>
  let consoleLogSpy: jest.SpyInstance
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(async () => {
    queryBus = {
      execute: jest.fn()
    } as any

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        __project_name_pascal__CreatedConsumer,
        { provide: QueryBus, useValue: queryBus }
      ]
    }).compile()

    consumer = module.get(__project_name_pascal__CreatedConsumer)
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should execute query and log result for valid __project_name_pascal__Created event', async () => {
    // Arrange
    const event: __project_name_pascal__CreatedEvent = {
      __project_name_camel__: { id: '__project_name_camel__-123' }
    } as any
    const envelope: Envelope = {
      type: '__project_name_pascal__Created',
      version: 1,
      payload: event
    }
    const mockResult = { id: '__project_name_camel__-123', name: 'Test' }
    queryBus.execute.mockResolvedValue(mockResult)

    // Act
    await consumer.handle(envelope)

    // Assert
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.any(Get__project_name_pascal__ByIdQuery)
    )

    expect(consoleLogSpy).toHaveBeenCalledWith(
      '✅ Ejemplo recuperado por ID:',
      mockResult
    )

    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  it('should ignore event if type is not __project_name_pascal__Created', async () => {
    // Arrange
    const envelope: Envelope = {
      type: 'OtherEvent',
      version: 1,
      payload: { __project_name_camel__: { id: '__project_name_camel__-123' } }
    }

    // Act
    await consumer.handle(envelope)

    // Assert
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(queryBus.execute).not.toHaveBeenCalled()

    expect(consoleLogSpy).not.toHaveBeenCalled()

    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  it('should ignore event if version is not 1', async () => {
    // Arrange
    const envelope: Envelope = {
      type: '__project_name_pascal__Created',
      version: 2,
      payload: { __project_name_camel__: { id: '__project_name_camel__-123' } }
    }

    // Act
    await consumer.handle(envelope)

    // Assert
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(queryBus.execute).not.toHaveBeenCalled()

    expect(consoleLogSpy).not.toHaveBeenCalled()

    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  it('should log error if exception is thrown', async () => {
    // Arrange
    const event: __project_name_pascal__CreatedEvent = {
      __project_name_camel__: { id: '__project_name_camel__-123' }
    } as any
    const envelope: Envelope = {
      type: '__project_name_pascal__Created',
      version: 1,
      payload: event
    }
    const error = new Error('Query failed')
    queryBus.execute.mockRejectedValue(error)

    // Act
    await consumer.handle(envelope)

    // Assert
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.any(Get__project_name_pascal__ByIdQuery)
    )

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '❌ Error al decodificar el mensaje:',
      error
    )
  })
})

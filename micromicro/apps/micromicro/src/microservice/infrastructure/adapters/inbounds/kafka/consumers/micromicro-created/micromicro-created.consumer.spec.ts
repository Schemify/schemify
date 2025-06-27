import { Test, TestingModule } from '@nestjs/testing'
import { QueryBus } from '@nestjs/cqrs'

import { MicromicroCreatedConsumer } from './micromicro-created.consumer'
import { Envelope } from '@micromicro/libs/shared/events/event-envelope'
import { MicromicroCreatedEvent } from '@micromicro/microservice/domain/events/micromicro-created.event'
import { GetMicromicroByIdQuery } from '@micromicro/microservice/application/ports/inbounds/queries'

describe('MicromicroCreatedConsumer', () => {
  let consumer: MicromicroCreatedConsumer
  let queryBus: jest.Mocked<QueryBus>
  let consoleLogSpy: jest.SpyInstance
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(async () => {
    queryBus = {
      execute: jest.fn()
    } as any

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MicromicroCreatedConsumer,
        { provide: QueryBus, useValue: queryBus }
      ]
    }).compile()

    consumer = module.get(MicromicroCreatedConsumer)
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should execute query and log result for valid MicromicroCreated event', async () => {
    // Arrange
    const event: MicromicroCreatedEvent = {
      micromicro: { id: 'micromicro-123' }
    } as any
    const envelope: Envelope = {
      type: 'MicromicroCreated',
      version: 1,
      payload: event
    }
    const mockResult = { id: 'micromicro-123', name: 'Test' }
    queryBus.execute.mockResolvedValue(mockResult)

    // Act
    await consumer.handle(envelope)

    // Assert
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.any(GetMicromicroByIdQuery)
    )

    expect(consoleLogSpy).toHaveBeenCalledWith(
      '✅ Ejemplo recuperado por ID:',
      mockResult
    )

    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  it('should ignore event if type is not MicromicroCreated', async () => {
    // Arrange
    const envelope: Envelope = {
      type: 'OtherEvent',
      version: 1,
      payload: { micromicro: { id: 'micromicro-123' } }
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
      type: 'MicromicroCreated',
      version: 2,
      payload: { micromicro: { id: 'micromicro-123' } }
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
    const event: MicromicroCreatedEvent = {
      micromicro: { id: 'micromicro-123' }
    } as any
    const envelope: Envelope = {
      type: 'MicromicroCreated',
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
      expect.any(GetMicromicroByIdQuery)
    )

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '❌ Error al decodificar el mensaje:',
      error
    )
  })
})

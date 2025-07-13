import { Test, TestingModule } from '@nestjs/testing'
import { QueryBus } from '@nestjs/cqrs'

import { MicroserviceNameCreatedConsumer } from './microserviceName-created.consumer'
import { Envelope } from '@microserviceName/libs/shared/events/event-envelope'
import { MicroserviceNameCreatedEvent } from '@microserviceName/microservice/domain/events/microserviceName-created.event'
import { GetMicroserviceNameByIdQuery } from '@microserviceName/microservice/application/ports/inbounds/queries'

describe('MicroserviceNameCreatedConsumer', () => {
  let consumer: MicroserviceNameCreatedConsumer
  let queryBus: jest.Mocked<QueryBus>
  let consoleLogSpy: jest.SpyInstance
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(async () => {
    queryBus = {
      execute: jest.fn()
    } as any

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MicroserviceNameCreatedConsumer,
        { provide: QueryBus, useValue: queryBus }
      ]
    }).compile()

    consumer = module.get(MicroserviceNameCreatedConsumer)
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should execute query and log result for valid MicroserviceNameCreated event', async () => {
    // Arrange
    const event: MicroserviceNameCreatedEvent = {
      microserviceName: { id: 'microserviceName-123' }
    } as any
    const envelope: Envelope = {
      type: 'MicroserviceNameCreated',
      version: 1,
      payload: event
    }
    const mockResult = { id: 'microserviceName-123', name: 'Test' }
    queryBus.execute.mockResolvedValue(mockResult)

    // Act
    await consumer.handle(envelope)

    // Assert
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.any(GetMicroserviceNameByIdQuery)
    )

    expect(consoleLogSpy).toHaveBeenCalledWith(
      '✅ Ejemplo recuperado por ID:',
      mockResult
    )

    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  it('should ignore event if type is not MicroserviceNameCreated', async () => {
    // Arrange
    const envelope: Envelope = {
      type: 'OtherEvent',
      version: 1,
      payload: { microserviceName: { id: 'microserviceName-123' } }
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
      type: 'MicroserviceNameCreated',
      version: 2,
      payload: { microserviceName: { id: 'microserviceName-123' } }
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
    const event: MicroserviceNameCreatedEvent = {
      microserviceName: { id: 'microserviceName-123' }
    } as any
    const envelope: Envelope = {
      type: 'MicroserviceNameCreated',
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
      expect.any(GetMicroserviceNameByIdQuery)
    )

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '❌ Error al decodificar el mensaje:',
      error
    )
  })
})

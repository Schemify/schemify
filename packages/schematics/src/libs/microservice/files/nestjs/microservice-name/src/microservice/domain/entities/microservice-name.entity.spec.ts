import { MicroserviceNameEntity } from './microserviceName.entity'
import { MicroserviceNameCreatedEvent } from '../events/microserviceName-created.event'
import { MicroserviceNameRenamedEvent } from '../events/microserviceName-renamed.event'
import { MicroserviceNameDescriptionUpdatedEvent } from '../events/microserviceName-description-updated.event'
import { NameValueObject } from '../value-objects/name.value-object'
import { DescriptionValueObject } from '../value-objects/description.value-object'

describe('MicroserviceNameEntity', () => {
  describe('create', () => {
    it('should create entity with valid data', () => {
      // Arrange & Act
      const entity = MicroserviceNameEntity.create({
        name: 'MicroserviceName Test',
        description: 'Descripción del microserviceName'
      })

      // Assert
      expect(entity.id).toBeDefined()
      expect(entity.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      ) // UUID format
      expect(entity.props.name.value).toBe('MicroserviceName Test')
      expect(entity.props.description?.value).toBe(
        'Descripción del microserviceName'
      )
      expect(entity.props.createdAt).toBeInstanceOf(Date)
      expect(entity.props.updatedAt).toBeInstanceOf(Date)
      expect(entity.props.createdAt).toEqual(entity.props.updatedAt)
    })

    it('should create entity without description', () => {
      // Arrange & Act
      const entity = MicroserviceNameEntity.create({
        name: 'MicroserviceName Sin Descripción'
      })

      // Assert
      expect(entity.props.name.value).toBe('MicroserviceName Sin Descripción')
      expect(entity.props.description?.value).toBe('')
    })

    it('should emit MicroserviceNameCreatedEvent when created', () => {
      // Arrange & Act
      const entity = MicroserviceNameEntity.create({
        name: 'MicroserviceName Evento',
        description: 'Descripción'
      })

      // Assert
      const events = entity.getUncommittedEvents()
      expect(events).toHaveLength(1)
      expect(events[0]).toBeInstanceOf(MicroserviceNameCreatedEvent)

      const createdEvent = events[0] as MicroserviceNameCreatedEvent
      expect(createdEvent.microserviceName).toBe(entity)
      expect(createdEvent.occurredAt).toBeInstanceOf(Date)
    })

    it('should create entity with trimmed description', () => {
      // Arrange & Act
      const entity = MicroserviceNameEntity.create({
        name: 'MicroserviceName Trim',
        description: '  Descripción con espacios  '
      })

      // Assert
      expect(entity.props.description?.value).toBe('Descripción con espacios')
    })
  })

  describe('toPrimitives', () => {
    it('should convert entity to primitives correctly', () => {
      // Arrange
      const entity = MicroserviceNameEntity.create({
        name: 'MicroserviceName Primitivo',
        description: 'Descripción primitiva'
      })

      // Act
      const primitives = entity.toPrimitives()

      // Assert
      expect(primitives).toEqual({
        id: entity.id,
        name: 'MicroserviceName Primitivo',
        description: 'Descripción primitiva',
        createdAt: entity.props.createdAt,
        updatedAt: entity.props.updatedAt
      })
    })

    it('should handle null description in primitives', () => {
      // Arrange
      const entity = MicroserviceNameEntity.create({
        name: 'MicroserviceName Sin Desc'
      })

      // Act
      const primitives = entity.toPrimitives()

      // Assert
      expect(primitives.description).toBe('')
    })
  })

  describe('update', () => {
    it('should update name and emit MicroserviceNameRenamedEvent', () => {
      // Arrange
      const entity = MicroserviceNameEntity.create({
        name: 'Nombre Original',
        description: 'Descripción original'
      })
      const originalUpdatedAt = entity.props.updatedAt

      // Act
      entity.update({ name: 'Nuevo Nombre' })

      // Assert
      expect(entity.props.name.value).toBe('Nuevo Nombre')
      expect(entity.props.description?.value).toBe('Descripción original') // Unchanged
      expect(entity.props.updatedAt).toBeDefined()
      expect(originalUpdatedAt).toBeDefined()
      if (entity.props.updatedAt && originalUpdatedAt) {
        expect(entity.props.updatedAt.getTime()).toBeGreaterThanOrEqual(
          originalUpdatedAt.getTime()
        )
      }

      const events = entity.getUncommittedEvents()
      const renameEvent = events.find(
        (e) => e instanceof MicroserviceNameRenamedEvent
      )
      expect(renameEvent).toBeInstanceOf(MicroserviceNameRenamedEvent)
    })

    it('should update description and emit MicroserviceNameDescriptionUpdatedEvent', () => {
      // Arrange
      const entity = MicroserviceNameEntity.create({
        name: 'MicroserviceName Desc',
        description: 'Descripción original'
      })

      // Act
      entity.update({ description: 'Nueva descripción' })

      // Assert
      expect(entity.props.description?.value).toBe('Nueva descripción')
      expect(entity.props.name.value).toBe('MicroserviceName Desc') // Unchanged

      const events = entity.getUncommittedEvents()
      const descEvent = events.find(
        (e) => e instanceof MicroserviceNameDescriptionUpdatedEvent
      )
      expect(descEvent).toBeInstanceOf(MicroserviceNameDescriptionUpdatedEvent)
    })

    it('should update both name and description', () => {
      // Arrange
      const entity = MicroserviceNameEntity.create({
        name: 'Original',
        description: 'Original'
      })

      // Act
      entity.update({
        name: 'Nuevo',
        description: 'Nuevo'
      })

      // Assert
      expect(entity.props.name.value).toBe('Nuevo')
      expect(entity.props.description?.value).toBe('Nuevo')

      const events = entity.getUncommittedEvents()
      expect(
        events.some((e) => e instanceof MicroserviceNameRenamedEvent)
      ).toBe(true)
      expect(
        events.some((e) => e instanceof MicroserviceNameDescriptionUpdatedEvent)
      ).toBe(true)
    })

    it('should not update if values are the same', () => {
      // Arrange
      const entity = MicroserviceNameEntity.create({
        name: 'Mismo Nombre',
        description: 'Misma Descripción'
      })
      const originalUpdatedAt = entity.props.updatedAt

      // Act
      entity.update({
        name: 'Mismo Nombre',
        description: 'Misma Descripción'
      })

      // Assert
      expect(entity.props.updatedAt).toEqual(originalUpdatedAt)

      const events = entity.getUncommittedEvents()
      expect(
        events.filter(
          (e) =>
            e instanceof MicroserviceNameRenamedEvent ||
            e instanceof MicroserviceNameDescriptionUpdatedEvent
        )
      ).toHaveLength(0)
    })

    it('should handle partial updates', () => {
      // Arrange
      const entity = MicroserviceNameEntity.create({
        name: 'Original',
        description: 'Original'
      })

      // Act - Only update name
      entity.update({ name: 'Solo Nombre' })

      // Assert
      expect(entity.props.name.value).toBe('Solo Nombre')
      expect(entity.props.description?.value).toBe('Original')

      const events = entity.getUncommittedEvents()
      expect(
        events.some((e) => e instanceof MicroserviceNameRenamedEvent)
      ).toBe(true)
      expect(
        events.some((e) => e instanceof MicroserviceNameDescriptionUpdatedEvent)
      ).toBe(false)
    })

    it('should handle undefined values in update', () => {
      // Arrange
      const entity = MicroserviceNameEntity.create({
        name: 'Original',
        description: 'Original'
      })

      // Act
      entity.update({
        name: undefined,
        description: undefined
      })

      // Assert
      expect(entity.props.name.value).toBe('Original')
      expect(entity.props.description?.value).toBe('Original')

      const events = entity.getUncommittedEvents()
      expect(
        events.filter(
          (e) =>
            e instanceof MicroserviceNameRenamedEvent ||
            e instanceof MicroserviceNameDescriptionUpdatedEvent
        )
      ).toHaveLength(0)
    })
  })

  describe('constructor', () => {
    it('should create entity with existing data', () => {
      // Arrange
      const id = 'test-id-123'
      const name = NameValueObject.create('MicroserviceName Constructor')
      const description = DescriptionValueObject.create(
        'Descripción constructor'
      )
      const createdAt = new Date('2023-01-01')
      const updatedAt = new Date('2023-01-02')

      // Act
      const entity = new MicroserviceNameEntity(id, {
        name,
        description,
        createdAt,
        updatedAt
      })

      // Assert
      expect(entity.id).toBe(id)
      expect(entity.props.name).toBe(name)
      expect(entity.props.description).toBe(description)
      expect(entity.props.createdAt).toBe(createdAt)
      expect(entity.props.updatedAt).toBe(updatedAt)
    })
  })

  describe('business rules', () => {
    it('should maintain data integrity after multiple updates', () => {
      // Arrange
      const entity = MicroserviceNameEntity.create({
        name: 'MicroserviceName Inicial',
        description: 'Descripción inicial'
      })

      // Act
      entity.update({ name: 'Primera Actualización' })
      entity.update({ description: 'Segunda Actualización' })
      entity.update({
        name: 'Tercera Actualización',
        description: 'Tercera Actualización'
      })

      // Assert
      expect(entity.props.name.value).toBe('Tercera Actualización')
      expect(entity.props.description?.value).toBe('Tercera Actualización')
      expect(entity.props.updatedAt).toBeDefined()
      if (entity.props.updatedAt) {
        expect(entity.props.updatedAt.getTime()).toBeGreaterThanOrEqual(
          entity.props.createdAt.getTime()
        )
      }
    })

    it('should accumulate events from multiple operations', () => {
      // Arrange
      const entity = MicroserviceNameEntity.create({
        name: 'MicroserviceName Eventos',
        description: 'Descripción eventos'
      })

      // Act
      entity.update({ name: 'Nuevo Nombre' })
      entity.update({ description: 'Nueva Descripción' })

      // Assert
      const events = entity.getUncommittedEvents()
      expect(events).toHaveLength(3) // 1 create + 1 rename + 1 description update
      expect(events[0]).toBeInstanceOf(MicroserviceNameCreatedEvent)
      expect(events[1]).toBeInstanceOf(MicroserviceNameRenamedEvent)
      expect(events[2]).toBeInstanceOf(MicroserviceNameDescriptionUpdatedEvent)
    })
  })
})

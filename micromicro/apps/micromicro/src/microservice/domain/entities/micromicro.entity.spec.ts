import { MicromicroEntity } from './micromicro.entity'
import { MicromicroCreatedEvent } from '../events/micromicro-created.event'
import { MicromicroRenamedEvent } from '../events/micromicro-renamed.event'
import { MicromicroDescriptionUpdatedEvent } from '../events/micromicro-description-updated.event'
import { NameValueObject } from '../value-objects/name.value-object'
import { DescriptionValueObject } from '../value-objects/description.value-object'

describe('MicromicroEntity', () => {
  describe('create', () => {
    it('should create entity with valid data', () => {
      // Arrange & Act
      const entity = MicromicroEntity.create({
        name: 'Micromicro Test',
        description: 'Descripción del micromicro'
      })

      // Assert
      expect(entity.id).toBeDefined()
      expect(entity.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      ) // UUID format
      expect(entity.props.name.value).toBe('Micromicro Test')
      expect(entity.props.description?.value).toBe(
        'Descripción del micromicro'
      )
      expect(entity.props.createdAt).toBeInstanceOf(Date)
      expect(entity.props.updatedAt).toBeInstanceOf(Date)
      expect(entity.props.createdAt).toEqual(entity.props.updatedAt)
    })

    it('should create entity without description', () => {
      // Arrange & Act
      const entity = MicromicroEntity.create({
        name: 'Micromicro Sin Descripción'
      })

      // Assert
      expect(entity.props.name.value).toBe(
        'Micromicro Sin Descripción'
      )
      expect(entity.props.description?.value).toBe('')
    })

    it('should emit MicromicroCreatedEvent when created', () => {
      // Arrange & Act
      const entity = MicromicroEntity.create({
        name: 'Micromicro Evento',
        description: 'Descripción'
      })

      // Assert
      const events = entity.getUncommittedEvents()
      expect(events).toHaveLength(1)
      expect(events[0]).toBeInstanceOf(MicromicroCreatedEvent)

      const createdEvent = events[0] as MicromicroCreatedEvent
      expect(createdEvent.micromicro).toBe(entity)
      expect(createdEvent.occurredAt).toBeInstanceOf(Date)
    })

    it('should create entity with trimmed description', () => {
      // Arrange & Act
      const entity = MicromicroEntity.create({
        name: 'Micromicro Trim',
        description: '  Descripción con espacios  '
      })

      // Assert
      expect(entity.props.description?.value).toBe('Descripción con espacios')
    })
  })

  describe('toPrimitives', () => {
    it('should convert entity to primitives correctly', () => {
      // Arrange
      const entity = MicromicroEntity.create({
        name: 'Micromicro Primitivo',
        description: 'Descripción primitiva'
      })

      // Act
      const primitives = entity.toPrimitives()

      // Assert
      expect(primitives).toEqual({
        id: entity.id,
        name: 'Micromicro Primitivo',
        description: 'Descripción primitiva',
        createdAt: entity.props.createdAt,
        updatedAt: entity.props.updatedAt
      })
    })

    it('should handle null description in primitives', () => {
      // Arrange
      const entity = MicromicroEntity.create({
        name: 'Micromicro Sin Desc'
      })

      // Act
      const primitives = entity.toPrimitives()

      // Assert
      expect(primitives.description).toBe('')
    })
  })

  describe('update', () => {
    it('should update name and emit MicromicroRenamedEvent', () => {
      // Arrange
      const entity = MicromicroEntity.create({
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
        (e) => e instanceof MicromicroRenamedEvent
      )
      expect(renameEvent).toBeInstanceOf(MicromicroRenamedEvent)
    })

    it('should update description and emit MicromicroDescriptionUpdatedEvent', () => {
      // Arrange
      const entity = MicromicroEntity.create({
        name: 'Micromicro Desc',
        description: 'Descripción original'
      })

      // Act
      entity.update({ description: 'Nueva descripción' })

      // Assert
      expect(entity.props.description?.value).toBe('Nueva descripción')
      expect(entity.props.name.value).toBe('Micromicro Desc') // Unchanged

      const events = entity.getUncommittedEvents()
      const descEvent = events.find(
        (e) => e instanceof MicromicroDescriptionUpdatedEvent
      )
      expect(descEvent).toBeInstanceOf(
        MicromicroDescriptionUpdatedEvent
      )
    })

    it('should update both name and description', () => {
      // Arrange
      const entity = MicromicroEntity.create({
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
        events.some((e) => e instanceof MicromicroRenamedEvent)
      ).toBe(true)
      expect(
        events.some(
          (e) => e instanceof MicromicroDescriptionUpdatedEvent
        )
      ).toBe(true)
    })

    it('should not update if values are the same', () => {
      // Arrange
      const entity = MicromicroEntity.create({
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
            e instanceof MicromicroRenamedEvent ||
            e instanceof MicromicroDescriptionUpdatedEvent
        )
      ).toHaveLength(0)
    })

    it('should handle partial updates', () => {
      // Arrange
      const entity = MicromicroEntity.create({
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
        events.some((e) => e instanceof MicromicroRenamedEvent)
      ).toBe(true)
      expect(
        events.some(
          (e) => e instanceof MicromicroDescriptionUpdatedEvent
        )
      ).toBe(false)
    })

    it('should handle undefined values in update', () => {
      // Arrange
      const entity = MicromicroEntity.create({
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
            e instanceof MicromicroRenamedEvent ||
            e instanceof MicromicroDescriptionUpdatedEvent
        )
      ).toHaveLength(0)
    })
  })

  describe('constructor', () => {
    it('should create entity with existing data', () => {
      // Arrange
      const id = 'test-id-123'
      const name = NameValueObject.create('Micromicro Constructor')
      const description = DescriptionValueObject.create(
        'Descripción constructor'
      )
      const createdAt = new Date('2023-01-01')
      const updatedAt = new Date('2023-01-02')

      // Act
      const entity = new MicromicroEntity(id, {
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
      const entity = MicromicroEntity.create({
        name: 'Micromicro Inicial',
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
      const entity = MicromicroEntity.create({
        name: 'Micromicro Eventos',
        description: 'Descripción eventos'
      })

      // Act
      entity.update({ name: 'Nuevo Nombre' })
      entity.update({ description: 'Nueva Descripción' })

      // Assert
      const events = entity.getUncommittedEvents()
      expect(events).toHaveLength(3) // 1 create + 1 rename + 1 description update
      expect(events[0]).toBeInstanceOf(MicromicroCreatedEvent)
      expect(events[1]).toBeInstanceOf(MicromicroRenamedEvent)
      expect(events[2]).toBeInstanceOf(
        MicromicroDescriptionUpdatedEvent
      )
    })
  })
})

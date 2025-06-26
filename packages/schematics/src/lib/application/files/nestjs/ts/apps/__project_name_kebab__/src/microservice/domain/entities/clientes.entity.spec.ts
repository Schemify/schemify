import { __project_name_pascal__Entity } from './__project_name_kebab__.entity'
import { __project_name_pascal__CreatedEvent } from '../events/__project_name_kebab__-created.event'
import { __project_name_pascal__RenamedEvent } from '../events/__project_name_kebab__-renamed.event'
import { __project_name_pascal__DescriptionUpdatedEvent } from '../events/__project_name_kebab__-description-updated.event'
import { NameValueObject } from '../value-objects/name.value-object'
import { DescriptionValueObject } from '../value-objects/description.value-object'

describe('__project_name_pascal__Entity', () => {
  describe('create', () => {
    it('should create entity with valid data', () => {
      // Arrange & Act
      const entity = __project_name_pascal__Entity.create({
        name: 'Cliente Test',
        description: 'Descripción del cliente'
      })

      // Assert
      expect(entity.id).toBeDefined()
      expect(entity.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      ) // UUID format
      expect(entity.props.name.value).toBe('Cliente Test')
      expect(entity.props.description?.value).toBe('Descripción del cliente')
      expect(entity.props.createdAt).toBeInstanceOf(Date)
      expect(entity.props.updatedAt).toBeInstanceOf(Date)
      expect(entity.props.createdAt).toEqual(entity.props.updatedAt)
    })

    it('should create entity without description', () => {
      // Arrange & Act
      const entity = __project_name_pascal__Entity.create({
        name: 'Cliente Sin Descripción'
      })

      // Assert
      expect(entity.props.name.value).toBe('Cliente Sin Descripción')
      expect(entity.props.description?.value).toBe('')
    })

    it('should emit __project_name_pascal__CreatedEvent when created', () => {
      // Arrange & Act
      const entity = __project_name_pascal__Entity.create({
        name: 'Cliente Evento',
        description: 'Descripción'
      })

      // Assert
      const events = entity.getUncommittedEvents()
      expect(events).toHaveLength(1)
      expect(events[0]).toBeInstanceOf(__project_name_pascal__CreatedEvent)

      const createdEvent = events[0] as __project_name_pascal__CreatedEvent
      expect(createdEvent.__project_name_kebab__).toBe(entity)
      expect(createdEvent.occurredAt).toBeInstanceOf(Date)
    })

    it('should create entity with trimmed description', () => {
      // Arrange & Act
      const entity = __project_name_pascal__Entity.create({
        name: 'Cliente Trim',
        description: '  Descripción con espacios  '
      })

      // Assert
      expect(entity.props.description?.value).toBe('Descripción con espacios')
    })
  })

  describe('toPrimitives', () => {
    it('should convert entity to primitives correctly', () => {
      // Arrange
      const entity = __project_name_pascal__Entity.create({
        name: 'Cliente Primitivo',
        description: 'Descripción primitiva'
      })

      // Act
      const primitives = entity.toPrimitives()

      // Assert
      expect(primitives).toEqual({
        id: entity.id,
        name: 'Cliente Primitivo',
        description: 'Descripción primitiva',
        createdAt: entity.props.createdAt,
        updatedAt: entity.props.updatedAt
      })
    })

    it('should handle null description in primitives', () => {
      // Arrange
      const entity = __project_name_pascal__Entity.create({
        name: 'Cliente Sin Desc'
      })

      // Act
      const primitives = entity.toPrimitives()

      // Assert
      expect(primitives.description).toBe('')
    })
  })

  describe('update', () => {
    it('should update name and emit __project_name_pascal__RenamedEvent', () => {
      // Arrange
      const entity = __project_name_pascal__Entity.create({
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
      const renameEvent = events.find((e) => e instanceof __project_name_pascal__RenamedEvent)
      expect(renameEvent).toBeInstanceOf(__project_name_pascal__RenamedEvent)
    })

    it('should update description and emit __project_name_pascal__DescriptionUpdatedEvent', () => {
      // Arrange
      const entity = __project_name_pascal__Entity.create({
        name: 'Cliente Desc',
        description: 'Descripción original'
      })

      // Act
      entity.update({ description: 'Nueva descripción' })

      // Assert
      expect(entity.props.description?.value).toBe('Nueva descripción')
      expect(entity.props.name.value).toBe('Cliente Desc') // Unchanged

      const events = entity.getUncommittedEvents()
      const descEvent = events.find(
        (e) => e instanceof __project_name_pascal__DescriptionUpdatedEvent
      )
      expect(descEvent).toBeInstanceOf(__project_name_pascal__DescriptionUpdatedEvent)
    })

    it('should update both name and description', () => {
      // Arrange
      const entity = __project_name_pascal__Entity.create({
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
      expect(events.some((e) => e instanceof __project_name_pascal__RenamedEvent)).toBe(true)
      expect(
        events.some((e) => e instanceof __project_name_pascal__DescriptionUpdatedEvent)
      ).toBe(true)
    })

    it('should not update if values are the same', () => {
      // Arrange
      const entity = __project_name_pascal__Entity.create({
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
            e instanceof __project_name_pascal__RenamedEvent ||
            e instanceof __project_name_pascal__DescriptionUpdatedEvent
        )
      ).toHaveLength(0)
    })

    it('should handle partial updates', () => {
      // Arrange
      const entity = __project_name_pascal__Entity.create({
        name: 'Original',
        description: 'Original'
      })

      // Act - Only update name
      entity.update({ name: 'Solo Nombre' })

      // Assert
      expect(entity.props.name.value).toBe('Solo Nombre')
      expect(entity.props.description?.value).toBe('Original')

      const events = entity.getUncommittedEvents()
      expect(events.some((e) => e instanceof __project_name_pascal__RenamedEvent)).toBe(true)
      expect(
        events.some((e) => e instanceof __project_name_pascal__DescriptionUpdatedEvent)
      ).toBe(false)
    })

    it('should handle undefined values in update', () => {
      // Arrange
      const entity = __project_name_pascal__Entity.create({
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
            e instanceof __project_name_pascal__RenamedEvent ||
            e instanceof __project_name_pascal__DescriptionUpdatedEvent
        )
      ).toHaveLength(0)
    })
  })

  describe('constructor', () => {
    it('should create entity with existing data', () => {
      // Arrange
      const id = 'test-id-123'
      const name = NameValueObject.create('Cliente Constructor')
      const description = DescriptionValueObject.create(
        'Descripción constructor'
      )
      const createdAt = new Date('2023-01-01')
      const updatedAt = new Date('2023-01-02')

      // Act
      const entity = new __project_name_pascal__Entity(id, {
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
      const entity = __project_name_pascal__Entity.create({
        name: 'Cliente Inicial',
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
      const entity = __project_name_pascal__Entity.create({
        name: 'Cliente Eventos',
        description: 'Descripción eventos'
      })

      // Act
      entity.update({ name: 'Nuevo Nombre' })
      entity.update({ description: 'Nueva Descripción' })

      // Assert
      const events = entity.getUncommittedEvents()
      expect(events).toHaveLength(3) // 1 create + 1 rename + 1 description update
      expect(events[0]).toBeInstanceOf(__project_name_pascal__CreatedEvent)
      expect(events[1]).toBeInstanceOf(__project_name_pascal__RenamedEvent)
      expect(events[2]).toBeInstanceOf(__project_name_pascal__DescriptionUpdatedEvent)
    })
  })
})

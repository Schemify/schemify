import { MicroserviceNameMapper } from './microserviceName.mapper'
import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microserviceName.entity'
import { MicroserviceNameCreatedEvent } from '@microserviceName/microservice/domain/events/microserviceName-created.event'

describe('MicroserviceNameMapper', () => {
  let mapper: MicroserviceNameMapper

  beforeEach(() => {
    mapper = new MicroserviceNameMapper()
  })

  describe('protoToProps', () => {
    it('should transform proto to props with name and description', () => {
      // Arrange
      const proto = {
        name: 'Test MicroserviceName',
        description: 'Test Description'
      }

      // Act
      const result = mapper.protoToProps(proto)

      // Assert
      expect(result.name.value).toBe('Test MicroserviceName')
      expect(result.description?.value).toBe('Test Description')
    })

    it('should transform proto to props with only name', () => {
      // Arrange
      const proto = {
        name: 'Test MicroserviceName'
        // No description
      }

      // Act
      const result = mapper.protoToProps(proto)

      // Assert
      expect(result.name.value).toBe('Test MicroserviceName')
      expect(result.description?.value).toBe('')
    })

    it('should handle empty description', () => {
      // Arrange
      const proto = {
        name: 'Test MicroserviceName',
        description: ''
      }

      // Act
      const result = mapper.protoToProps(proto)

      // Assert
      expect(result.name.value).toBe('Test MicroserviceName')
      expect(result.description?.value).toBe('')
    })

    it('should validate name through NameValueObject', () => {
      // Arrange
      const proto = {
        name: 'Te', // Too short
        description: 'Test Description'
      }

      // Act & Assert
      expect(() => mapper.protoToProps(proto)).toThrow(
        'Name must be at least 3 characters'
      )
    })

    it('should validate description through DescriptionValueObject', () => {
      // Arrange
      const longDescription = 'a'.repeat(301) // Too long
      const proto = {
        name: 'Test MicroserviceName',
        description: longDescription
      }

      // Act & Assert
      expect(() => mapper.protoToProps(proto)).toThrow(
        'Description exceeds max length of 300'
      )
    })
  })

  describe('entityToProto', () => {
    it('should transform entity to proto successfully', () => {
      // Arrange
      const entity = MicroserviceNameEntity.create({
        name: 'Test MicroserviceName',
        description: 'Test Description'
      })

      // Act
      const result = mapper.entityToProto(entity)

      // Assert
      expect(result).toEqual({
        id: entity.id,
        name: 'Test MicroserviceName',
        description: 'Test Description'
      })
    })

    it('should transform entity without description to proto', () => {
      // Arrange
      const entity = MicroserviceNameEntity.create({
        name: 'Test MicroserviceName'
        // No description
      })

      // Act
      const result = mapper.entityToProto(entity)

      // Assert
      expect(result).toEqual({
        id: entity.id,
        name: 'Test MicroserviceName',
        description: ''
      })
    })

    it('should throw error when entity is undefined', () => {
      // Act & Assert
      expect(() => mapper.entityToProto(undefined as any)).toThrow(
        'entityToProto: received undefined entity'
      )
    })

    it('should throw error when entity is null', () => {
      // Act & Assert
      expect(() => mapper.entityToProto(null as any)).toThrow(
        'entityToProto: received undefined entity'
      )
    })
  })

  describe('toPrimitives', () => {
    it('should transform entity to primitives successfully', () => {
      // Arrange
      const entity = MicroserviceNameEntity.create({
        name: 'Test MicroserviceName',
        description: 'Test Description'
      })

      // Act
      const result = mapper.toPrimitives(entity)

      // Assert
      expect(result).toEqual({
        id: entity.id,
        name: 'Test MicroserviceName',
        description: 'Test Description',
        createdAt: entity.props.createdAt,
        updatedAt: entity.props.updatedAt
      })
    })

    it('should transform entity without description to primitives', () => {
      // Arrange
      const entity = MicroserviceNameEntity.create({
        name: 'Test MicroserviceName'
        // No description
      })

      // Act
      const result = mapper.toPrimitives(entity)

      // Assert
      expect(result).toEqual({
        id: entity.id,
        name: 'Test MicroserviceName',
        description: '',
        createdAt: entity.props.createdAt,
        updatedAt: entity.props.updatedAt
      })
    })
  })

  describe('fromPrimitives', () => {
    it('should reconstruct entity from primitives successfully', () => {
      // Arrange
      const primitives = {
        id: 'test-id',
        name: 'Test MicroserviceName',
        description: 'Test Description',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02')
      }

      // Act
      const result = mapper.fromPrimitives(primitives)

      // Assert
      expect(result.id).toBe('test-id')
      expect(result.props.name.value).toBe('Test MicroserviceName')
      expect(result.props.description?.value).toBe('Test Description')
      expect(result.props.createdAt).toEqual(new Date('2023-01-01'))
      expect(result.props.updatedAt).toEqual(new Date('2023-01-02'))
    })

    it('should reconstruct entity from primitives without description', () => {
      // Arrange
      const primitives = {
        id: 'test-id',
        name: 'Test MicroserviceName',
        description: null,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02')
      }

      // Act
      const result = mapper.fromPrimitives(primitives)

      // Assert
      expect(result.id).toBe('test-id')
      expect(result.props.name.value).toBe('Test MicroserviceName')
      expect(result.props.description?.value).toBe('')
    })

    it('should use createdAt as updatedAt when updatedAt is not provided', () => {
      // Arrange
      const primitives = {
        id: 'test-id',
        name: 'Test MicroserviceName',
        description: 'Test Description',
        createdAt: new Date('2023-01-01')
        // No updatedAt
      }

      // Act
      const result = mapper.fromPrimitives(primitives)

      // Assert
      expect(result.props.updatedAt).toEqual(new Date('2023-01-01'))
    })

    it('should handle empty string description', () => {
      // Arrange
      const primitives = {
        id: 'test-id',
        name: 'Test MicroserviceName',
        description: '',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02')
      }

      // Act
      const result = mapper.fromPrimitives(primitives)

      // Assert
      expect(result.props.description?.value).toBe('')
    })
  })

  describe('fromEnvelope', () => {
    it('should transform MicroserviceNameCreatedEvent to CreateMicroserviceNameDto', () => {
      // Arrange
      const entity = MicroserviceNameEntity.create({
        name: 'Test MicroserviceName',
        description: 'Test Description'
      })
      const event = new MicroserviceNameCreatedEvent(entity)

      // Act
      const result = mapper.fromEnvelope(event)

      // Assert
      expect(result).toEqual({
        name: 'Test MicroserviceName',
        description: 'Test Description'
      })
    })

    it('should transform MicroserviceNameCreatedEvent without description', () => {
      // Arrange
      const entity = MicroserviceNameEntity.create({
        name: 'Test MicroserviceName'
        // No description
      })
      const event = new MicroserviceNameCreatedEvent(entity)

      // Act
      const result = mapper.fromEnvelope(event)

      // Assert
      expect(result).toEqual({
        name: 'Test MicroserviceName',
        description: ''
      })
    })
  })
})

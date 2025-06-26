import { NameValueObject } from './name.value-object'

describe('NameValueObject', () => {
  describe('create', () => {
    it('should create name with valid value', () => {
      // Arrange & Act
      const name = NameValueObject.create('Cliente Test')

      // Assert
      expect(name.value).toBe('Cliente Test')
    })

    it('should trim whitespace from name', () => {
      // Arrange & Act
      const name = NameValueObject.create('  Cliente con espacios  ')

      // Assert
      expect(name.value).toBe('Cliente con espacios')
    })

    it('should throw error for empty string', () => {
      // Arrange & Act & Assert
      expect(() => NameValueObject.create('')).toThrow('Name is required')
    })

    it('should throw error for undefined value', () => {
      // Arrange & Act & Assert
      expect(() => NameValueObject.create(undefined)).toThrow(
        'Name is required'
      )
    })

    it('should throw error for single character', () => {
      // Arrange & Act & Assert
      expect(() => NameValueObject.create('A')).toThrow(
        'Name must be at least 3 characters'
      )
    })

    it('should handle maximum length name', () => {
      // Arrange
      const maxLengthName = 'A'.repeat(NameValueObject.MAX_LENGTH)

      // Act
      const name = NameValueObject.create(maxLengthName)

      // Assert
      expect(name.value).toBe(maxLengthName)
      expect(name.value.length).toBe(NameValueObject.MAX_LENGTH)
    })
  })

  describe('validation', () => {
    it('should throw error when name exceeds maximum length', () => {
      // Arrange
      const tooLongName = 'A'.repeat(NameValueObject.MAX_LENGTH + 1)

      // Act & Assert
      expect(() => NameValueObject.create(tooLongName)).toThrow(
        `Name must be at most ${NameValueObject.MAX_LENGTH} characters`
      )
    })

    it('should throw error when name is too long after trimming', () => {
      const tooLongNameWithSpaces =
        'A'.repeat(NameValueObject.MAX_LENGTH + 1) + '  '
      expect(() => NameValueObject.create(tooLongNameWithSpaces)).toThrow(
        `Name must be at most ${NameValueObject.MAX_LENGTH} characters`
      )
    })
  })

  describe('equals', () => {
    it('should return true for same values', () => {
      // Arrange
      const name1 = NameValueObject.create('Cliente Test')
      const name2 = NameValueObject.create('Cliente Test')

      // Act & Assert
      expect(name1.equals(name2)).toBe(true)
    })

    it('should return false for different values', () => {
      // Arrange
      const name1 = NameValueObject.create('Cliente Test')
      const name2 = NameValueObject.create('Cliente Diferente')

      // Act & Assert
      expect(name1.equals(name2)).toBe(false)
    })

    it('should return false for same value with different casing', () => {
      // Arrange
      const name1 = NameValueObject.create('Cliente Test')
      const name2 = NameValueObject.create('cliente test')

      // Act & Assert
      expect(name1.equals(name2)).toBe(false)
    })

    it('should return true for same value with different whitespace', () => {
      // Arrange
      const name1 = NameValueObject.create('Cliente Test')
      const name2 = NameValueObject.create('  Cliente Test  ')

      // Act & Assert
      expect(name1.equals(name2)).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle special characters', () => {
      // Arrange & Act
      const name = NameValueObject.create('Cliente @#$%^&*()')

      // Assert
      expect(name.value).toBe('Cliente @#$%^&*()')
    })

    it('should handle numbers in name', () => {
      // Arrange & Act
      const name = NameValueObject.create('Cliente 123')

      // Assert
      expect(name.value).toBe('Cliente 123')
    })

    it('should handle unicode characters', () => {
      // Arrange & Act
      const name = NameValueObject.create('Cliente Español ñáéíóú')

      // Assert
      expect(name.value).toBe('Cliente Español ñáéíóú')
    })
  })
})

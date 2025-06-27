import { DescriptionValueObject } from './description.value-object'

describe('DescriptionValueObject', () => {
  describe('create', () => {
    it('should create description with valid value', () => {
      // Arrange & Act
      const description = DescriptionValueObject.create(
        'Descripción del __project_name_camel__'
      )

      // Assert
      expect(description.value).toBe('Descripción del __project_name_camel__')
    })

    it('should trim whitespace from description', () => {
      // Arrange & Act
      const description = DescriptionValueObject.create(
        '  Descripción con espacios  '
      )

      // Assert
      expect(description.value).toBe('Descripción con espacios')
    })

    it('should handle empty string', () => {
      // Arrange & Act
      const description = DescriptionValueObject.create('')

      // Assert
      expect(description.value).toBe('')
    })

    it('should handle undefined value', () => {
      // Arrange & Act
      const description = DescriptionValueObject.create(undefined)

      // Assert
      expect(description.value).toBe('')
    })

    it('should handle single character', () => {
      // Arrange & Act
      const description = DescriptionValueObject.create('A')

      // Assert
      expect(description.value).toBe('A')
    })

    it('should handle maximum length description', () => {
      // Arrange
      const maxLengthDescription = 'A'.repeat(DescriptionValueObject.MAX_LENGTH)

      // Act
      const description = DescriptionValueObject.create(maxLengthDescription)

      // Assert
      expect(description.value).toBe(maxLengthDescription)
      expect(description.value.length).toBe(DescriptionValueObject.MAX_LENGTH)
    })

    it('should handle very long description', () => {
      // Arrange
      const longDescription =
        'Esta es una descripción muy larga que contiene muchos caracteres para probar el comportamiento del value object cuando se manejan textos extensos que podrían ser utilizados para describir __project_name_camel__ con información detallada sobre sus características, necesidades y preferencias.'

      // Act
      const description = DescriptionValueObject.create(longDescription)

      // Assert
      expect(description.value).toBe(longDescription)
      expect(description.value.length).toBeLessThanOrEqual(
        DescriptionValueObject.MAX_LENGTH
      )
    })
  })

  describe('validation', () => {
    it('should throw error when description exceeds maximum length', () => {
      // Arrange
      const tooLongDescription = 'A'.repeat(
        DescriptionValueObject.MAX_LENGTH + 1
      )

      // Act & Assert
      expect(() => DescriptionValueObject.create(tooLongDescription)).toThrow(
        `Description exceeds max length of ${DescriptionValueObject.MAX_LENGTH}`
      )
    })

    it('should throw error when description is too long after trimming', () => {
      // Arrange
      const tooLongDescriptionWithSpaces =
        'A'.repeat(DescriptionValueObject.MAX_LENGTH + 1) + '  '

      // Act & Assert
      expect(() =>
        DescriptionValueObject.create(tooLongDescriptionWithSpaces)
      ).toThrow(
        `Description exceeds max length of ${DescriptionValueObject.MAX_LENGTH}`
      )
    })
  })

  describe('equals', () => {
    it('should return true for same values', () => {
      // Arrange
      const desc1 = DescriptionValueObject.create('Descripción Test')
      const desc2 = DescriptionValueObject.create('Descripción Test')

      // Act & Assert
      expect(desc1.equals(desc2)).toBe(true)
    })

    it('should return false for different values', () => {
      // Arrange
      const desc1 = DescriptionValueObject.create('Descripción Test')
      const desc2 = DescriptionValueObject.create('Descripción Diferente')

      // Act & Assert
      expect(desc1.equals(desc2)).toBe(false)
    })

    it('should return false for same value with different casing', () => {
      // Arrange
      const desc1 = DescriptionValueObject.create('Descripción Test')
      const desc2 = DescriptionValueObject.create('descripción test')

      // Act & Assert
      expect(desc1.equals(desc2)).toBe(false)
    })

    it('should return true for same value with different whitespace', () => {
      // Arrange
      const desc1 = DescriptionValueObject.create('Descripción Test')
      const desc2 = DescriptionValueObject.create('  Descripción Test  ')

      // Act & Assert
      expect(desc1.equals(desc2)).toBe(true)
    })

    it('should return true for empty strings', () => {
      // Arrange
      const desc1 = DescriptionValueObject.create('')
      const desc2 = DescriptionValueObject.create('')

      // Act & Assert
      expect(desc1.equals(desc2)).toBe(true)
    })

    it('should return true for undefined values', () => {
      // Arrange
      const desc1 = DescriptionValueObject.create(undefined)
      const desc2 = DescriptionValueObject.create(undefined)

      // Act & Assert
      expect(desc1.equals(desc2)).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle special characters', () => {
      // Arrange & Act
      const description = DescriptionValueObject.create('Descripción @#$%^&*()')

      // Assert
      expect(description.value).toBe('Descripción @#$%^&*()')
    })

    it('should handle numbers in description', () => {
      // Arrange & Act
      const description = DescriptionValueObject.create(
        '__project_name_pascal__ número 123'
      )

      // Assert
      expect(description.value).toBe('__project_name_pascal__ número 123')
    })

    it('should handle unicode characters', () => {
      // Arrange & Act
      const description = DescriptionValueObject.create(
        'Descripción en Español ñáéíóú'
      )

      // Assert
      expect(description.value).toBe('Descripción en Español ñáéíóú')
    })

    it('should handle only whitespace', () => {
      // Arrange & Act
      const description = DescriptionValueObject.create('   ')

      // Assert
      expect(description.value).toBe('')
    })

    it('should handle multiline text', () => {
      // Arrange & Act
      const description = DescriptionValueObject.create(
        'Línea 1\nLínea 2\nLínea 3'
      )

      // Assert
      expect(description.value).toBe('Línea 1\nLínea 2\nLínea 3')
    })

    it('should handle tabs and other whitespace characters', () => {
      // Arrange & Act
      const description = DescriptionValueObject.create(
        'Texto\tcon\ttabs\ty\tespacios'
      )

      // Assert
      expect(description.value).toBe('Texto\tcon\ttabs\ty\tespacios')
    })
  })

  describe('business rules', () => {
    it('should always return a string value', () => {
      // Arrange & Act
      const desc1 = DescriptionValueObject.create('Texto normal')
      const desc2 = DescriptionValueObject.create('')
      const desc3 = DescriptionValueObject.create(undefined)

      // Assert
      expect(typeof desc1.value).toBe('string')
      expect(typeof desc2.value).toBe('string')
      expect(typeof desc3.value).toBe('string')
    })

    it('should preserve content integrity', () => {
      // Arrange
      const originalText = 'Descripción original con contenido importante'

      // Act
      const description = DescriptionValueObject.create(originalText)

      // Assert
      expect(description.value).toBe(originalText)
      expect(description.value.length).toBe(originalText.length)
    })
  })
})

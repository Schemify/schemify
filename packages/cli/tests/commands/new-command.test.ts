import { describe, it, expect, vi, Mock, beforeEach } from 'vitest'
import { CLIArgumentParser } from '../../src/cli-argument-parser'
import { ProjectScaffolder } from '@schemifyjs/core'

// Mocks
const scaffoldMock = vi.fn()

vi.mock('@schemifyjs/core', () => {
  return {
    ProjectScaffolder: vi.fn().mockImplementation(() => ({
      scaffold: scaffoldMock
    }))
  }
})

describe('CLIArgumentParser - comando `new`', () => {
  let parser: CLIArgumentParser

  beforeEach(() => {
    parser = new CLIArgumentParser()
    scaffoldMock.mockClear()
    ;(ProjectScaffolder as Mock).mockClear()
  })

  it('debe ejecutar `scaffold` con los argumentos correctos cuando se pasa el comando `new` con todos los flags', async () => {
    const argv = [
      'node',
      'schemify',
      'new',
      'microservice',
      '--name',
      'test-app',
      '--pm',
      'npm',
      '--framework',
      'nestjs'
    ]

    await parser.parse(argv)

    // Verifica instancia
    expect(ProjectScaffolder).toHaveBeenCalledTimes(1)
    expect(scaffoldMock).toHaveBeenCalledTimes(1)
    expect(scaffoldMock).toHaveBeenCalledWith({
      name: 'test-app',
      template: 'microservice',
      framework: 'nestjs',
      packageManager: 'npm'
    })
  })
})

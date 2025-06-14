import { describe, it, expect } from 'vitest'
import { execa } from 'execa'
import { join } from 'path'

const CLI_PATH = join(__dirname, '../bin/schemify.ts')

describe('CLI Bin Entry', () => {
  it('muestra ayuda si no se pasa ningún comando', async () => {
    const result = await execa('tsx', [CLI_PATH], { reject: false })

    expect(result.exitCode).toBe(0)
    expect(result.stdout.toLowerCase()).toContain('usage')
    expect(result.stdout.toLowerCase()).toContain('schemify')
  })

  it('acepta "new" con --help', async () => {
    const result = await execa('tsx', [CLI_PATH, 'new', '--help'], {
      reject: false
    })
    expect(result.exitCode).toBe(0)
    expect(result.stdout.toLowerCase()).toContain('crea un nuevo proyecto')
  })
})

import 'tsconfig-paths/register'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(__dirname, './.env.test') })

// Performance optimizations
jest.setTimeout(10000) // 10 seconds timeout

// Disable console.log during tests for faster execution
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}

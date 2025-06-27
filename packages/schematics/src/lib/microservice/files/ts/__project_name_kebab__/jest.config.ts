import type { Config } from 'jest'

export default (): Config => {
  return {
    displayName: '__project_name_camel__',
    rootDir: '.',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest'
    },
    moduleFileExtensions: ['js', 'json', 'ts'],
    testEnvironment: 'node',
    moduleNameMapper: {
      '^@__project_name_camel__/(.*)$': '<rootDir>/src/$1',
      '^@proto$': '<rootDir>/../../libs/proto/generated/index.ts'
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    // Performance optimizations
    maxWorkers: '50%',
    cache: true,
    cacheDirectory: '<rootDir>/node_modules/.cache/jest'
  }
}

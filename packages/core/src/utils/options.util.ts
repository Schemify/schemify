import { SCHEMIFY_CORE_VERSIONS } from '../constants/core-versions.js'

export function buildSchemifyVersions(): Record<string, string> {
  return {
    schemifyCliVersion: SCHEMIFY_CORE_VERSIONS['@schemifyjs/cli'],
    schemifyCoreVersion: SCHEMIFY_CORE_VERSIONS['@schemifyjs/core'],
    schemifyTypesVersion: SCHEMIFY_CORE_VERSIONS['@schemifyjs/types'],
    schemifySchematicsVersion: SCHEMIFY_CORE_VERSIONS['@schemifyjs/schematics']
  }
}

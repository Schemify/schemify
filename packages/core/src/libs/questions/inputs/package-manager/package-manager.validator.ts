import { PackageManagerType } from '@schemifyjs/types'

export function validatePackageManager(value: string): true | string {
  return Object.values(PackageManagerType).includes(value as PackageManagerType)
    ? true
    : 'Please select a valid package manager.'
}

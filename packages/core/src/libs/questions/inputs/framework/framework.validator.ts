import { FrameworkType } from '@schemifyjs/types'

export function validateFramework(value: string): true | string {
  return Object.values(FrameworkType).includes(value as FrameworkType)
    ? true
    : 'Please select a valid framework.'
}

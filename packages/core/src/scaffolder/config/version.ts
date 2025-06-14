export interface ScaffoldingContextProps {
  schemifyCliVersion?: string
  schemifyCoreVersion?: string
  schemifyTypesVersion?: string
}

export class ScaffoldingContext {
  readonly schemifyCliVersion: string
  readonly schemifyCoreVersion: string
  readonly schemifyTypesVersion: string

  constructor(props: ScaffoldingContextProps = {}) {
    this.schemifyCliVersion = props.schemifyCliVersion ?? '^0.1.45'
    this.schemifyCoreVersion = props.schemifyCoreVersion ?? '^0.1.36'
    this.schemifyTypesVersion = props.schemifyTypesVersion ?? '^0.1.14'
  }

  toObject(): Record<string, string> {
    return {
      schemifyCliVersion: this.schemifyCliVersion,
      schemifyCoreVersion: this.schemifyCoreVersion,
      schemifyTypesVersion: this.schemifyTypesVersion
    }
  }
}

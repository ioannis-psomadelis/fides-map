// === UI State Enums (we control these, not the data) ===

export const LayoutMode = {
  BySystemType: 'system_type',
  ByDataUse: 'data_use',
} as const
export type LayoutMode = (typeof LayoutMode)[keyof typeof LayoutMode]

export const Theme = {
  Light: 'light',
  Dark: 'dark',
} as const
export type Theme = (typeof Theme)[keyof typeof Theme]

// === Domain Interfaces ===

export interface PrivacyDeclaration {
  readonly name: string
  readonly data_categories: readonly string[]
  readonly data_subjects: readonly string[]
  readonly data_use: string
}

export interface System {
  readonly fides_key: string
  readonly name: string
  readonly description: string
  readonly system_type: string
  readonly privacy_declarations: readonly PrivacyDeclaration[]
  readonly system_dependencies: readonly string[]
}

// === Display Types ===

export interface SystemGroup {
  readonly key: string
  readonly label: string
  readonly systems: readonly System[]
}

// === Arrow Types ===

export interface DependencyArrow {
  readonly id: string
  readonly sourceKey: string
  readonly targetKey: string
  readonly path: string
}

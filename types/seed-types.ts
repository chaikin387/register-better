export type CategorySeed = {
  slug: string
  name: string
  icon?: string
  sortOrder: number
  isActive?: boolean
  children?: CategorySeed[]
}

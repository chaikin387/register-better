export type CategorySeed = {
  slug: string
  name: string
  icon?: string
  image?: string
  sortOrder: number
  isActive?: boolean
  children?: CategorySeed[]
}

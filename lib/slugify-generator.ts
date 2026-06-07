// lib/slugify.ts
import slugify from 'slugify'

const options = {
  lower: true,
  strict: true,
  locale: 'ru',
} satisfies Parameters<typeof slugify>[1]

export function generateSlug(text: string): string {
  return slugify(text, options)
}

export function generateProductSlug(name: string, id: number): string {
  return `${generateSlug(name)}-${id}`
}

// lib/slugify-generator.ts
import slugify from 'slugify'

const options = {
  lower: true,
  strict: true,
  locale: 'ru',
} satisfies Parameters<typeof slugify>[1]

export function generateSlug(text: string): string {
  return slugify(text, options)
}

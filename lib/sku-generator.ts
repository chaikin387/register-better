export function generateSku(id: number): string {
  const idStr = id.toString().padStart(4, '0')
  const prefix = Math.floor(1000 + Math.random() * 9000)
  return `${prefix}${idStr}`
}

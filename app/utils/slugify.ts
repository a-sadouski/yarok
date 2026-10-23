export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/ё/g, 'e')
    .replace(/[^a-zа-я0-9\s-]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

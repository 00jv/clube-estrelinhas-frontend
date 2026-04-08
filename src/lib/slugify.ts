/**
 * Converts a string to a URL-friendly slug.
 * Example: "Moda Praia" -> "moda-praia"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
}

/**
 * Attempt to reverse slugify (not perfect, but good for display if needed)
 * Example: "moda-praia" -> "Moda Praia"
 */
export function deslugify(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

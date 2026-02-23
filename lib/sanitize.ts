/**
 * Sanitize filenames for Supabase storage
 * Removes invalid characters and returns a safe filename
 */
export function sanitizeFileName(fileName: string): string {
  // Extract file extension
  const lastDotIndex = fileName.lastIndexOf(".")
  const extension = lastDotIndex > 0 ? fileName.slice(lastDotIndex) : ""
  const nameWithoutExt = lastDotIndex > 0 ? fileName.slice(0, lastDotIndex) : fileName

  // Replace or remove invalid characters
  // Keep only alphanumeric, underscores, hyphens, and spaces (which become underscores)
  let sanitized = nameWithoutExt
    .replace(/[^a-zA-Z0-9\s_-]/g, "") // Remove special chars and unicode
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/_+/g, "_") // Replace multiple underscores with single
    .toLowerCase() // Lowercase for consistency
    .trim()

  // If completely empty after sanitization, use a generic name
  if (!sanitized) {
    sanitized = `audio_${Date.now()}`
  }

  // Limit length (Supabase has path length limits)
  if (sanitized.length > 200) {
    sanitized = sanitized.slice(0, 200)
  }

  return sanitized + extension.toLowerCase()
}

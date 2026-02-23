/**
 * Format time in milliseconds to mm:ss format
 * @param ms - Time in milliseconds
 * @returns Formatted time string in mm:ss format
 */
export function formatTimeMMSS(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Parse time string in mm:ss format to milliseconds
 * @param timeString - Time string in mm:ss format
 * @returns Time in milliseconds, or 0 if invalid
 */
export function parseTimeMMSS(timeString: string): number {
  const parts = timeString.split(':')
  if (parts.length !== 2) return 0
  
  const minutes = parseInt(parts[0], 10)
  const seconds = parseInt(parts[1], 10)
  
  if (isNaN(minutes) || isNaN(seconds) || seconds >= 60) return 0
  
  return (minutes * 60 + seconds) * 1000
}

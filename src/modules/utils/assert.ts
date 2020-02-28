export const isTruthy = <T>(value: T) => {
  if (value) {
    if (typeof value === 'string') {
      return !!value.trim()
    } else if (typeof value === 'number') {
      return !isNaN(value) && value !== Infinity && (value > 0 || value < 0)
    } else if (Array.isArray(value)) {
      return value.length > 0
    }

    return !!value;
  }

  return false
}

export const isNotNull = <T>(value: T | null): value is T => value != null

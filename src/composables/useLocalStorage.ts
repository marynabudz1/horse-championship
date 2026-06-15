export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore storage errors
  }
}

export function loadFromStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key)
    if (item === null) return null
    return JSON.parse(item) as T
  } catch {
    return null
  }
}

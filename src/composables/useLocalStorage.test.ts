import { describe, it, expect, beforeEach } from 'vitest'
import { saveToStorage, loadFromStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('saves and loads a value', () => {
    saveToStorage('key1', { name: 'Thunder' })
    expect(loadFromStorage('key1')).toEqual({ name: 'Thunder' })
  })

  it('returns null for a missing key', () => {
    expect(loadFromStorage('nonexistent')).toBeNull()
  })

  it('saves and loads an array', () => {
    saveToStorage('arr', [1, 2, 3])
    expect(loadFromStorage('arr')).toEqual([1, 2, 3])
  })

  it('overwrites an existing key', () => {
    saveToStorage('key1', 'first')
    saveToStorage('key1', 'second')
    expect(loadFromStorage('key1')).toBe('second')
  })

  it('returns null when stored value is invalid JSON', () => {
    localStorage.setItem('bad', '{invalid json')
    expect(loadFromStorage('bad')).toBeNull()
  })
})

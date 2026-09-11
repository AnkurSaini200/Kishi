import { useCallback } from 'react'
export function useClipboard() { return useCallback((value: string) => navigator.clipboard.writeText(value), []) }

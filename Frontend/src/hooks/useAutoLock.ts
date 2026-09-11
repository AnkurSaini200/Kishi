import { useEffect } from 'react'
export function useAutoLock(onLock: () => void, timeout = 15 * 60 * 1000) { useEffect(() => { const timer = window.setTimeout(onLock, timeout); return () => window.clearTimeout(timer) }, [onLock, timeout]) }

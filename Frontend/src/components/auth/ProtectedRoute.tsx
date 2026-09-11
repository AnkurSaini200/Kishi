import type { ReactNode } from 'react'
export function ProtectedRoute({ children, authenticated = true }: { children: ReactNode; authenticated?: boolean }) { return authenticated ? children : null }

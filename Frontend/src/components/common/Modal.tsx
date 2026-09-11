import type { ReactNode } from 'react'
export function Modal({ children, title }: { children: ReactNode; title: string }) { return <section aria-label={title}>{children}</section> }

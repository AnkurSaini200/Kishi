import type { ReactNode } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
export function AppLayout({ children }: { children: ReactNode }) { return <div className="app-shell"><Sidebar /><main className="main-content"><Header />{children}</main></div> }

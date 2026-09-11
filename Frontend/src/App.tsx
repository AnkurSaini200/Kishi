import './App.css'
import { AppLayout } from './components/layout/AppLayout'
import { Vault } from './pages/Vault'
import { Login } from './pages/Login'
import { VaultProvider } from './contexts/VaultContext'
import { AuthProvider, useAuthContext } from './contexts/AuthContext'

function AppContent() {
  const { isAuthenticated } = useAuthContext()

  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <VaultProvider>
      <AppLayout>
        <Vault />
      </AppLayout>
    </VaultProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App

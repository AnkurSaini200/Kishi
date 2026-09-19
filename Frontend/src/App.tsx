import { useState } from 'react';
import './App.css';
import { AppLayout } from './components/layout/AppLayout';
import type { AppPage } from './components/layout/Sidebar';
import { Vault } from './pages/Vault';
import { Security } from './pages/Security';
import { Settings } from './pages/Settings';
import PasswordGenerator from './components/password/PasswordGenerator';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { VaultProvider } from './contexts/VaultContext';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';

function AppContent() {
  const { isAuthenticated } = useAuthContext();
  const [activePage, setActivePage] = useState<AppPage>('vault');
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  if (!isAuthenticated) {
    return authView === 'login' ? (
      <Login onSwitchToRegister={() => setAuthView('register')} />
    ) : (
      <Register onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  const renderActivePage = () => {
    switch (activePage) {
      case 'vault':
        return <Vault />;
      case 'security':
        return <Security />;
      case 'generator':
        return (
          <div className="flex-1 min-w-0">
            <PasswordGenerator />
          </div>
        );
      case 'settings':
        return <Settings />;
      default:
        return <Vault />;
    }
  };

  return (
    <VaultProvider>
      <AppLayout activePage={activePage} onNavigate={setActivePage}>
        {renderActivePage()}
      </AppLayout>
    </VaultProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

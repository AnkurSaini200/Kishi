import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { VaultCryptoProvider } from './contexts/VaultCryptoContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VaultCryptoProvider>
      <App />
    </VaultCryptoProvider>
  </StrictMode>
);

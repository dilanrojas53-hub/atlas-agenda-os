import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'sonner';
import App from './AtlasApp';
import { AtlasStoreProvider } from './state/AtlasStore';
import './styles.css';
import './adminTables.css';
import './customerDashboard.css';
import './adminPremium.css';
import './marketingHome.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AtlasStoreProvider>
      <App />
      <Toaster position="top-center" richColors />
    </AtlasStoreProvider>
  </React.StrictMode>
);

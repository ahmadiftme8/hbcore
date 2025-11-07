import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { App } from '@/components/App.tsx';
import './i18n/config';
import './index.css';

// Don't modify below line
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}
const root = ReactDOM.createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

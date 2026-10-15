import React from 'react';
import { createRoot } from 'react-dom/client';
import 'animal-island-ui/style';
import './styles/theme.css';
import './styles/global.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import './index.css'
import { getConfig } from './config';

const config = getConfig();
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Auth0Provider
    domain={config.domain}
    clientId={config.clientId}
    redirectUri="http://localhost:3000/home"
    audience={config.audience}
    scope="openid profile email"
  >
    <Router>
      <App />
    </Router>
  </Auth0Provider>
);

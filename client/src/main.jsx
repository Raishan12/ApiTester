import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react';
import { ThemeProvider } from './context/ThemeContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain="raishan.us.auth0.com"
      clientId="t4Y0jHBJuijt46O8an588rhRzjBH2ajv"
      authorizationParams={{
        redirect_uri: "http://localhost:5173"
      }}
      cacheLocation='localstorage'
    >
      <ThemeProvider>
      <App />
      </ThemeProvider>
    </Auth0Provider>
  </StrictMode>,
)

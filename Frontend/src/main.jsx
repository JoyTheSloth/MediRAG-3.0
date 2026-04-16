import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

// Global error catcher for debugging blank screen
window.onerror = function(msg, url, lineNo, columnNo, error) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="padding: 40px; color: red;">
      <h1>CRITICAL RUNTIME ERROR</h1>
      <p>${msg}</p>
      <pre>${error?.stack || ''}</pre>
    </div>`;
  }
  return false;
};

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  )
} catch (err) {
  const root = document.getElementById('root');
  if (root) {
      root.innerHTML = `<div style="padding: 40px; color: red;"><h1>RENDER ERROR</h1><p>${err.message}</p></div>`;
  }
  console.error(err);
}

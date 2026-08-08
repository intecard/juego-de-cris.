/// <reference types="vite/client" />
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// MEJORA: Verificación de seguridad para garantizar que el contenedor existe antes de inyectar el juego.
// Esto evita la temida "pantalla blanca de la muerte" en React.
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Error crítico: No se encontró el elemento con el id 'root' en el index.html.");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
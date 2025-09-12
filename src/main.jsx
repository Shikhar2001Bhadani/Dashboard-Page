import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { DashboardProvider } from './context/DashboardContext'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DashboardProvider>
      <App />
    </DashboardProvider>
  </React.StrictMode>
)

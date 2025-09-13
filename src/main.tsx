import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Main.tsx is loading...')

// Add fallback content to the root div immediately
const rootElement = document.getElementById('root')
if (rootElement) {
  rootElement.innerHTML = '<div style="padding: 20px; font-family: Arial;">Loading React app...</div>'
}

try {
  console.log('Attempting to create React root...')
  const root = ReactDOM.createRoot(document.getElementById('root')!)
  
  console.log('Rendering React app...')
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
  console.log('React app rendered successfully!')
} catch (error) {
  console.error('Failed to render React app:', error)
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; color: red; font-family: Arial;">
        <h2>Failed to load React app</h2>
        <p>Error: ${error}</p>
        <p>Please check the browser console for more details.</p>
      </div>
    `
  }
}
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { FirebaseProvider } from './context/Firebase'
import { BrowserRouter } from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <BrowserRouter>
    <FirebaseProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </FirebaseProvider>
  </BrowserRouter>
)

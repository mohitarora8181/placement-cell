import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {FirebaseProvider} from './context/Firebase'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <FirebaseProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </FirebaseProvider>
);



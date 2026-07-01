// index.js
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

import { ConfigProvider } from 'antd';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#800000', // Maroon
          colorSuccess: '#b5e487', // Light green
          fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
          borderRadius: 6,
        },
        components: {
          Button: {
            colorPrimary: '#800000',
            colorPrimaryHover: '#600000',
            colorPrimaryActive: '#400000',
          },
          Layout: {
            headerBg: '#ffffff',
            bodyBg: '#f4f4f5', // zinc-100
          }
        }
      }}
    >
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  </StrictMode>,
)
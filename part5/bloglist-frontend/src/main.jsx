import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { UserContextProvider } from './components/UserContext'
import { NotificationContextProvider } from './components/NotificationContext'
import { BrowserRouter } from 'react-router-dom'
import './index.css'


const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <NotificationContextProvider>
        <UserContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </UserContextProvider>
      </NotificationContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
)



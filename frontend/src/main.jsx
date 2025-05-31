import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { viVN } from '@clerk/localizations'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//clerk
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <ToastContainer />
    <ClerkProvider localization={viVN} publishableKey={PUBLISHABLE_KEY} afterSignOutUrl='/'
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
      }}>
      <App />
    </ClerkProvider>
  </StrictMode>,
)

import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { CookiesProvider } from 'react-cookie'
import { ModalState } from './contexts/ModalContext.tsx'
import { AuthState } from './contexts/AuthContext.tsx'
import { FetchState } from './contexts/FetchContext.tsx'
import { LoginDialogState } from './contexts/LoginDialogContext.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <CookiesProvider>
      <ModalState>
        <AuthState>
          <FetchState>
            <LoginDialogState>
              <App />
            </LoginDialogState>
          </FetchState>
        </AuthState>
      </ModalState>
    </CookiesProvider>
  </BrowserRouter>,
)

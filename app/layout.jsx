import './globals.css'
import ReduxProvider from './providers/ReduxProvider'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'Dashboard - Gestion de Stock',
  description: 'Application de gestion de stock avec Dashboard IA',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <ReduxProvider>
          {children}
          <Toaster position="top-right" />
        </ReduxProvider>
      </body>
    </html>
  )
}

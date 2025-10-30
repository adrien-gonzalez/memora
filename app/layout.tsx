import './globals.css'
import { ReactNode } from 'react'
import Provider from '@/components/Provider'

export const metadata = {
  title: 'Pense-bêtes',
  description: 'Gestion de pense-bêtes hiérarchiques',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-zinc-950 text-zinc-100">
        <main className="max-w-6xl 2xl:max-w-7xl mx-auto p-6">
          {/* On enveloppe tout avec le client component */}
          <Provider>
            {children}
          </Provider>
        </main>
      </body>
    </html>
  )
}

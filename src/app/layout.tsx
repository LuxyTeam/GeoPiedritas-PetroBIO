import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GeoPiedritas - Rocas Sedimentarias',
  description: 'Plataforma educativa interactiva para el estudio de rocas sedimentarias. Explora su formación, clasificación, diagénesis y modelos 3D de minerales.',
  keywords: ['geología', 'rocas sedimentarias', 'educativo', 'diagénesis', 'formación', 'minerales 3D', 'ciencias de la tierra'],
  authors: [{ name: 'GeoPiedritas Team' }],
  openGraph: {
    title: 'GeoPiedritas - El Mundo de las Rocas Sedimentarias',
    description: 'Descubre cómo el tiempo y la presión crean la historia de la Tierra. Modelos 3D, guías interactivas y más.',
    url: 'https://geopiedritas.vercel.app',
    siteName: 'GeoPiedritas',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1491466424936-e304919aada7?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Estratos de rocas sedimentarias',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GeoPiedritas - Rocas Sedimentarias',
    description: 'Plataforma educativa interactiva sobre geología sedimentaria.',
    images: ['https://images.unsplash.com/photo-1491466424936-e304919aada7?q=80&w=1200&auto=format&fit=crop'],
  },
  manifest: '/manifest.json',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.className}>
      <head>
        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
        {/* Material Symbols */}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Symbols+Rounded"
          rel="stylesheet"
        />
        {/* Preload critical resources */}
        <link rel="preload" href="/_next/static/css/app/layout.css" as="style" />
      </head>
      <body className="min-h-screen bg-beige-base text-brown-base font-inter">
        {/* Skip navigation link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-ocre-base focus:text-white focus:rounded-lg"
        >
          Ir al contenido principal
        </a>
        {children}
      </body>
    </html>
  )
}
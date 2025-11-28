import './globals.css'
import React from 'react'
import { Playfair_Display, Inter } from 'next/font/google'

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400','600','700'], variable: '--font-title' })
const inter = Inter({ subsets: ['latin'], variable: '--font-body' })

export const metadata = {
  title: 'GEREZIM — Recreated',
  description: 'Esqueleto do projeto GEREZIM reconstruído (Next.js + Tailwind + Supabase)'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${playfair.variable} ${inter.variable}`}>
        <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
          <header className="border-b border-slate-200 py-4">
            <div className="container flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full w-10 h-10 bg-navy-800 flex items-center justify-center text-white font-bold">G</div>
                <div>
                  <div className="text-lg font-semibold">GEREZIM</div>
                  <div className="text-sm text-slate-500">Plataforma Recriada</div>
                </div>
              </div>
              <nav className="text-sm text-slate-600">Esqueleto • Next.js + Tailwind</nav>
            </div>
          </header>

          <main className="container py-10">{children}</main>

          <footer className="border-t border-slate-200 py-6 mt-12">
            <div className="container text-sm text-slate-500">© {new Date().getFullYear()} GEREZIM — Recriado</div>
          </footer>
        </div>
      </body>
    </html>
  )
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Exemplo simples de middleware para proteger rotas do dashboard.
 * Deve ser adaptado e integrado com Supabase/NextAuth conforme necessário.
 */
export function middleware(request: NextRequest) {
  // rota protegida exemplo: /dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Placeholder: implementar checagem de sessão aqui.
    // Se não autenticado, redirecionar para /login
    // const isAuthenticated = ...
    // if (!isAuthenticated) return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

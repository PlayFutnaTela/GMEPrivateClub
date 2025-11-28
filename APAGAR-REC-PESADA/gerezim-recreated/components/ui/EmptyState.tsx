"use client"
import React from 'react'
import { Package } from 'lucide-react'
import { Button } from './button'

import Link from 'next/link'

export function EmptyState({ title, description, backHref }: { title?: string; description?: string; backHref?: string }) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-12">
      <div className="p-6 rounded-full bg-slate-100 text-slate-600 mb-4">
        <Package size={34} />
      </div>

      <h3 className="text-lg font-semibold text-slate-700">{title ?? 'Nenhum produto encontrado'}</h3>
      <p className="text-sm text-slate-500 mt-2 text-center max-w-md">{description ?? 'Não há itens ativos nessa categoria no momento.'}</p>

      <div className="mt-6">
        {backHref ? (
          <Link href={backHref}><Button variant="ghost">Voltar para Oportunidades</Button></Link>
        ) : (
          <Button variant="ghost">Voltar para Oportunidades</Button>
        )}
      </div>
    </div>
  )
}

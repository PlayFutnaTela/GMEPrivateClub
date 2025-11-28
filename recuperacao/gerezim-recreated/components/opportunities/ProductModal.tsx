"use client"
import React, { useState } from 'react'
import { supabaseClient } from '../../lib/supabase/client'
import { Button } from '../ui/button'
import { toast, Toaster } from 'sonner'

export default function ProductModal({ product, userProfile, onClose }: { product: any; userProfile?: any; onClose: () => void }) {
  const [loading, setLoading] = useState(false)

  async function handleInterest() {
    setLoading(true)
    try {
      // Create a lead/contact record associating user and product
      const payload: any = {
        full_name: userProfile?.full_name ?? 'Interessado',
        phone: null,
        interests: [product.title],
        source: 'interesse_oportunidade',
        product_id: product.id,
        user_id: userProfile?.id ?? null
      }

      const { error } = await supabaseClient.from('contacts').insert([payload])
      setLoading(false)
      if (error) {
        toast.error('Erro ao registrar interesse: ' + error.message)
        return
      }

      toast.success('Interesse registrado — nossa equipe entrará em contato.')
      onClose()
    } catch (err) {
      setLoading(false)
      toast.error('Erro inesperado')
    }
  }

  return (
    <div className="space-y-4">
      <Toaster position="top-right" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-slate-100 rounded-md h-64 flex items-center justify-center overflow-hidden">
          {product.images && product.images[0] ? <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" /> : <div className="text-slate-400">Sem imagem</div>}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">{product.title}</h3>
              <div className="text-sm text-slate-500 mt-1">{product.category}</div>
            </div>

            <div className="text-right text-lg font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: product.currency ?? 'BRL' }).format(product.price ?? 0)}</div>
          </div>

          <div className="mt-4 text-sm text-slate-600">{product.description}</div>

          <div className="mt-6 flex items-center gap-3">
            <Button onClick={handleInterest} disabled={loading}>{loading ? 'Registrando...' : 'Tenho Interesse'}</Button>
            <Button variant="ghost" onClick={onClose}>Fechar</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

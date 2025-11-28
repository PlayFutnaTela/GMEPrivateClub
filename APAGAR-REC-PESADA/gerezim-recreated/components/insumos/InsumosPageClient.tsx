"use client"
import React, { useState } from 'react'
import InsumosList from './InsumosList'
import InsumoForm from './InsumoForm'
import { Button } from '../ui/button'

export default function InsumosPageClient({ initialInsumos }: { initialInsumos: any[] }) {
  const [insumos, setInsumos] = useState<any[]>(initialInsumos ?? [])
  const [editing, setEditing] = useState<any | null>(null)
  const [openForm, setOpenForm] = useState(false)

  function onAdd() {
    setEditing(null)
    setOpenForm(true)
  }

  function onEdit(item: any) {
    setEditing(item)
    setOpenForm(true)
  }

  function onClose() {
    setEditing(null)
    setOpenForm(false)
  }

  function handleSaved(saved: any) {
    // if exists update, else prepend
    setInsumos((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id)
      if (idx >= 0) {
        prev[idx] = saved
        return [...prev]
      }
      return [saved, ...prev]
    })
    onClose()
  }

  function handleDeleted(id: string) {
    setInsumos((s) => s.filter((i) => i.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">Total: {insumos.length} insumos</div>
        <div>
          <Button onClick={onAdd}>Novo Insumo</Button>
        </div>
      </div>

      <InsumosList insumos={insumos} onEdit={onEdit} onDelete={handleDeleted} />

      {openForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
          <div className="bg-white rounded-lg p-6 z-60 w-full max-w-2xl">
            <InsumoForm initial={editing} onCancel={onClose} onSaved={handleSaved} />
          </div>
        </div>
      )}
    </div>
  )
}

"use client"
import React, { useState } from 'react'
import { supabaseClient } from '../../lib/supabase/client'
import { Button } from '../ui/button'
import { toast, Toaster } from 'sonner'

export default function ProductForm({ initialProduct, onSaved }: { initialProduct?: any; onSaved?: (p:any)=>void }) {
  const [title, setTitle] = useState(initialProduct?.title ?? '')
  const [price, setPrice] = useState(initialProduct?.price ?? 0)
  const [category, setCategory] = useState(initialProduct?.category ?? '')
  const [stock, setStock] = useState(initialProduct?.stock ?? 0)
  const [description, setDescription] = useState(initialProduct?.description ?? '')
  const [status, setStatus] = useState(initialProduct?.status ?? 'active')
  const [images, setImages] = useState<string[]>(initialProduct?.images ?? [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    const uploadedUrls: string[] = []
    for (const f of Array.from(files)) {
      const path = `products/${Date.now()}-${f.name}`
      const { error: uploadError } = await supabaseClient.storage.from('products').upload(path, f, { upsert: false })
      if (uploadError) {
        toast.error('Erro no upload: ' + uploadError.message)
        continue
      }
      const { data } = supabaseClient.storage.from('products').getPublicUrl(path)
      uploadedUrls.push(data.publicUrl)
    }

    setImages((prev) => [...prev, ...uploadedUrls])
    setUploading(false)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const payload = {
        title,
        price: Number(price) || 0,
        category,
        stock: Number(stock) || 0,
        description,
        images,
        status
      }

      let result
      if (initialProduct?.id) {
        const { data, error } = await supabaseClient.from('products').update(payload).eq('id', initialProduct.id).select().single()
        if (error) throw error
        result = data
      } else {
        const { data, error } = await supabaseClient.from('products').insert([payload]).select().single()
        if (error) throw error
        result = data
      }

      setSaving(false)
      toast.success('Produto salvo com sucesso')
      onSaved?.(result)
      // reset form only on create
      if (!initialProduct) {
        setTitle(''); setPrice(0); setCategory(''); setStock(0); setDescription(''); setImages([])
      }
    } catch (err: any) {
      setSaving(false)
      toast.error('Erro ao salvar produto: ' + (err.message ?? String(err)))
    }
  }

  async function removeImage(url: string) {
    // Attempt to remove object from storage if path can be derived
    setImages((s) => s.filter((i) => i !== url))
  }

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
      <Toaster position="top-right" />
      <h3 className="font-semibold mb-3">{initialProduct ? 'Editar produto' : 'Novo produto'}</h3>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-slate-500">Título</label>
          <input value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full border rounded-md px-3 py-2" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-500">Preço</label>
            <input type="number" value={price} onChange={(e)=>setPrice(Number(e.target.value))} className="w-full border rounded-md px-3 py-2" />
          </div>

          <div>
            <label className="text-xs text-slate-500">Categoria</label>
            <input value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full border rounded-md px-3 py-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-500">Estoque</label>
            <input type="number" value={stock} onChange={(e)=>setStock(Number(e.target.value))} className="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="text-xs text-slate-500">Status</label>
            <select value={status} onChange={(e)=>setStatus(e.target.value)} className="w-full border rounded-md px-3 py-2">
              <option value="active">Ativo</option>
              <option value="draft">Rascunho</option>
              <option value="archived">Arquivado</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-500">Descrição</label>
          <textarea value={description} onChange={(e)=>setDescription(e.target.value)} rows={4} className="w-full border rounded-md px-3 py-2" />
        </div>

        <div>
          <label className="text-xs text-slate-500">Imagens</label>
          <div className="flex items-center gap-3 mt-2">
            <input type="file" multiple onChange={(e)=>handleUpload(e.target.files)} />
            {uploading && <div className="text-xs text-slate-500">Enviando...</div>}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {images.map((url) => (
              <div key={url} className="relative border rounded overflow-hidden h-24 bg-slate-50">
                <img src={url} alt="produto" className="w-full h-full object-cover" />
                <button onClick={()=>removeImage(url)} className="absolute right-1 top-1 text-xs px-2 py-1 bg-white/70 rounded">Remover</button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={() => {
            setTitle(''); setPrice(0); setCategory(''); setStock(0); setDescription(''); setImages([])
          }}>Limpar</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Salvando...' : (initialProduct ? 'Atualizar produto' : 'Criar produto')}</Button>
        </div>
      </div>
    </div>
  )
}

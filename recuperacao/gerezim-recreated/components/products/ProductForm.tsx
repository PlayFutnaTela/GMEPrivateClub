"use client"

import React, { useState, useEffect } from 'react'
import { createClient } from '../../lib/supabase/client'
import { toast } from 'sonner'

    type Product = {
      id: string
      title: string
      subtitle?: string
      description?: string
      price: number
      commission_percent?: number
      category: string
      status: string
      type: string
      tags: string[]
      stock: number
      images: string[]
      created_at: string
    }

    type Props = {
      onCreated?: () => void
      onUpdated?: (product: Product) => void
      onCancel?: () => void
      initialSession?: any
      product?: Product | null
    }

    const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
    const MAX_FILES = 30
    const MAX_FILE_MB = 15

    // Available categories from the opportunities search system
    const AVAILABLE_CATEGORIES = [
      'Carro',
      'Imovel',
      'Empresa',
      'Premium',
      'Eletronicos',
      'Cartas Contempladas',
      'Industrias',
      'Embarcações'
    ]

    // Brazilian states for location selection
    const BRAZILIAN_STATES = [
      { code: 'AC', name: 'Acre' },
      { code: 'AL', name: 'Alagoas' },
      { code: 'AP', name: 'Amapá' },
      { code: 'AM', name: 'Amazonas' },
      { code: 'BA', name: 'Bahia' },
      { code: 'CE', name: 'Ceará' },
      { code: 'DF', name: 'Distrito Federal' },
      { code: 'ES', name: 'Espírito Santo' },
      { code: 'GO', name: 'Goiás' },
      { code: 'MA', name: 'Maranhão' },
      { code: 'MT', name: 'Mato Grosso' },
      { code: 'MS', name: 'Mato Grosso do Sul' },
      { code: 'MG', name: 'Minas Gerais' },
      { code: 'PA', name: 'Pará' },
      { code: 'PB', name: 'Paraíba' },
      { code: 'PR', name: 'Paraná' },
      { code: 'PE', name: 'Pernambuco' },
      { code: 'PI', name: 'Piauí' },
      { code: 'RJ', name: 'Rio de Janeiro' },
      { code: 'RN', name: 'Rio Grande do Norte' },
      { code: 'RS', name: 'Rio Grande do Sul' },
      { code: 'RO', name: 'Rondônia' },
      { code: 'RR', name: 'Roraima' },
      { code: 'SC', name: 'Santa Catarina' },
      { code: 'SP', name: 'São Paulo' },
      { code: 'SE', name: 'Sergipe' },
      { code: 'TO', name: 'Tocantins' }
    ]

    // Categories that require location information
    const CATEGORIES_REQUIRING_LOCATION = ['Imovel', 'Empresas', 'Industrias']


    export default function ProductForm({ onCreated, onUpdated, onCancel, initialSession, product }: Props) {
      // Supabase client for database operations (insert/update products)
      const supabase = createClient(initialSession)

      const [title, setTitle] = useState('')
      const [subtitle, setSubtitle] = useState('')
      const [description, setDescription] = useState('')
      const [price, setPrice] = useState('0')
      const [currency, setCurrency] = useState('BRL')
      const [category, setCategory] = useState('')
      const [status, setStatus] = useState('draft')
      const [tags, setTags] = useState('')
      const [stock, setStock] = useState<number | ''>('')
      const [commission, setCommission] = useState('0')
      const [type, setType] = useState('produto')

      const [files, setFiles] = useState<File[]>([])
      const [previews, setPreviews] = useState<string[]>([])
      const [existingImages, setExistingImages] = useState<string[]>([])
      const [loading, setLoading] = useState(false)
      const [error, setError] = useState<string | null>(null)

      // Location-related states
      const [isNational, setIsNational] = useState<boolean | null>(null)
      const [locationInfo, setLocationInfo] = useState('')
      const [showLocationFields, setShowLocationFields] = useState(false)

      // Initialize form with product data if editing
      useEffect(() => {
        if (product) {
          setTitle(product.title)
          setSubtitle(product.subtitle || '')
          setDescription(product.description || '')
          setPrice(product.price.toString())
          setCurrency((product as any).currency || 'BRL')
          setCategory(product.category)
          setStatus(product.status)
          setTags(product.tags.join(', '))
          setStock(product.stock)
          setExistingImages(product.images)
          setType((product as any).type || 'produto')
          setCommission(((product as any).commission_percent ?? 0).toString())

          // Initialize location fields
          const prodWithLocation = product as any
          setIsNational(prodWithLocation.is_national ?? null)
          setLocationInfo(prodWithLocation.location_info || '')
          setShowLocationFields(CATEGORIES_REQUIRING_LOCATION.includes(product.category))
        } else {
          // Reset for new product
          setTitle('')
          setSubtitle('')
          setDescription('')
          setPrice('0')
          setCurrency('BRL')
          setCategory('')
          setStatus('draft')
          setTags('')
          setStock('')
          setType('produto')
          setCommission('0')
          setExistingImages([])
          setFiles([])
          setPreviews([])

          // Reset location fields
          setIsNational(null)
          setLocationInfo('')
          setShowLocationFields(false)
        }
      }, [product])

      // Update showLocationFields when category changes
      useEffect(() => {
        const shouldShow = CATEGORIES_REQUIRING_LOCATION.includes(category)
        setShowLocationFields(shouldShow)

        // Reset location fields when hiding
        if (!shouldShow) {
          setIsNational(null)
          setLocationInfo('')
        }
      }, [category])

      function addFiles(list: FileList | null) {
        if (!list) return
        const arr = Array.from(list)
        // checks — consider already existing images plus new pending files
        if ((existingImages.length || 0) + files.length + arr.length > MAX_FILES) {
          setError(`Máximo ${MAX_FILES} imagens no total`); return
        }
        for (const f of arr) {
          if (!SUPPORTED_TYPES.includes(f.type)) { setError('Formato não permitido'); return }
          if (f.size > MAX_FILE_MB * 1024 * 1024) { setError(`Arquivo maior que ${MAX_FILE_MB}MB`); return }
        }
        const newFiles = [...files, ...arr]
        setFiles(newFiles)
        const newPreviews = newFiles.map(f => URL.createObjectURL(f))
        setPreviews(newPreviews)
        setError(null)
      }

      async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
          // Validate location fields for specific categories
          if (CATEGORIES_REQUIRING_LOCATION.includes(category)) {
            if (isNational === null) {
              setError('Por favor, informe se é nacional ou internacional.')
              setLoading(false)
              return
            }
            if (!locationInfo || locationInfo.trim() === '') {
              setError(isNational
                ? 'Por favor, selecione o estado.'
                : 'Por favor, informe a localização internacional.')
              setLoading(false)
              return
            }
          }

          const payload = {
            title,
            subtitle,
            description,
            price: Number(price || 0),
            currency,
            category,
            status,
            type,
            tags: tags ? tags.split(',').map(t => t.trim()) : [],
            stock: Number(stock || 0),
            commission_percent: Number(commission || 0),
            is_national: showLocationFields ? isNational : null,
            location_info: showLocationFields ? locationInfo : null,
            images: []
          }

          let id: string
          if (product) {
            // Update existing product
            const { error: updateError } = await supabase
              .from('products')
              .update(payload)
              .eq('id', product.id)
            if (updateError) {
              setError(updateError.message)
              setLoading(false)
              return
            }
            id = product.id
          } else {
            // Insert new product
            const { data, error: insertError } = await supabase
              .from('products')
              .insert(payload)
              .select('id')
              .single()

            if (insertError || !data?.id) {
              if ((insertError as any)?.status === 409) {
                setError('Conflito ao inserir produto (409). Provavelmente uma constraint única foi violada.')
              } else {
                setError(insertError?.message || 'Erro ao inserir produto')
              }
              setLoading(false)
              return
            }
            id = data.id
          }

          const uploadedPaths: string[] = [...existingImages] // Keep existing images

          // Upload new files if any
          if (files.length > 0) {
            const formData = new FormData()
            formData.append('productId', id)
            files.forEach(file => formData.append('files', file))

            const uploadResponse = await fetch('/api/upload-images', {
              method: 'POST',
              body: formData,
            })

            if (!uploadResponse.ok) {
              const uploadError = await uploadResponse.json()
              setError(`Upload falhou: ${uploadError.error}`)
              setLoading(false)
              return
            }

            const uploadResult = await uploadResponse.json()
            uploadedPaths.push(...uploadResult.urls)
          }

          // Update product with all images
          const { error: updateError } = await supabase
            .from('products')
            .update({ images: uploadedPaths })
            .eq('id', id)
          if (updateError) {
            setError(updateError.message)
            setLoading(false)
            return
          }

          // Reset form if creating new
          if (!product) {
            setTitle('')
            setSubtitle('')
            setDescription('')
            setPrice('0')
            setCategory('')
            setTags('')
            setStock('')
            setFiles([])
            setPreviews([])
            setExistingImages([])
            setCommission('0')
          }

          setLoading(false)
          if (product && onUpdated) {
            // Fetch updated product
            const { data: updatedProduct } = await supabase
              .from('products')
              .select('*')
              .eq('id', id)
              .single()
            if (updatedProduct) {
              toast.success('✅ Produto atualizado com sucesso!', {
                description: `"${title}" foi atualizado.`
              })
              onUpdated(updatedProduct as Product)
            }
          } else if (onCreated) {
            toast.success('🎉 Produto cadastrado com sucesso!', {
              description: `"${title}" foi adicionado ao catálogo.`
            })
            onCreated()
          }
        } catch (err: any) {
          setError(err?.message || String(err))
          setLoading(false)
        }
      }

      function removeAt(i: number) {
        const copy = [...files]; copy.splice(i, 1); setFiles(copy)
        const prev = [...previews]; prev.splice(i, 1); setPreviews(prev)
      }

      function removeExistingImage(i: number) {
        const copy = [...existingImages]; copy.splice(i, 1); setExistingImages(copy)
      }

      return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow sm:max-w-3xl">
          {error && <div className="text-red-600">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Título</label>
              <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Subtítulo</label>
              <input value={subtitle} onChange={e => setSubtitle(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Descrição</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded px-3 py-2 mt-1 min-h-[120px]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <div>
              <label className="text-sm font-medium">Preço</label>
              <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Moeda</label>
              <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full border rounded px-3 py-2 mt-1">
                <option value="BRL">BRL (Real Brasileiro)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="USD">USD (Dólar Americano)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Tipo</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full border rounded px-3 py-2 mt-1">
                <option value="produto">Produto</option>
                <option value="oportunidade">Oportunidade</option>
              </select>
            </div>
            {/* SKU removed - no longer collected */}
            <div>
              <label className="text-sm font-medium">Categoria</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border rounded px-3 py-2 mt-1">
                <option value="">Selecione abaixo</option>
                {AVAILABLE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full border rounded px-3 py-2 mt-1">
                <option value="draft">Rascunho</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="archived">Arquivado</option>
              </select>
            </div>
          { /* location selection list continued below */ }
            // Supabase client for database operations (insert/update products)
            const supabase = createClient(initialSession)

            const [title, setTitle] = useState('')
            const [subtitle, setSubtitle] = useState('')
            const [description, setDescription] = useState('')
            const [price, setPrice] = useState('0')
            const [currency, setCurrency] = useState('BRL')
            const [category, setCategory] = useState('')
            const [status, setStatus] = useState('draft')
            const [tags, setTags] = useState('')
            const [stock, setStock] = useState<number | ''>('')
            const [commission, setCommission] = useState('0')
            const [type, setType] = useState('produto')

            const [files, setFiles] = useState<File[]>([])
            const [previews, setPreviews] = useState<string[]>([])
            const [existingImages, setExistingImages] = useState<string[]>([])
            const [loading, setLoading] = useState(false)
            const [error, setError] = useState<string | null>(null)

            // Location-related states
            const [isNational, setIsNational] = useState<boolean | null>(null)
            const [locationInfo, setLocationInfo] = useState('')
            const [showLocationFields, setShowLocationFields] = useState(false)

            // Initialize form with product data if editing
            useEffect(() => {
              if (product) {
                setTitle(product.title)
                setSubtitle(product.subtitle || '')
                setDescription(product.description || '')
                setPrice(product.price.toString())
                setCurrency((product as any).currency || 'BRL')
                setCategory(product.category)
                setStatus(product.status)
                setTags(product.tags.join(', '))
                setStock(product.stock)
                setExistingImages(product.images)
                setType((product as any).type || 'produto')
                setCommission(((product as any).commission_percent ?? 0).toString())

                // Initialize location fields
                const prodWithLocation = product as any
                setIsNational(prodWithLocation.is_national ?? null)
                setLocationInfo(prodWithLocation.location_info || '')
                setShowLocationFields(CATEGORIES_REQUIRING_LOCATION.includes(product.category))
              } else {
                // Reset for new product
                setTitle('')
                setSubtitle('')
                setDescription('')
                setPrice('0')
                setCurrency('BRL')
                setCategory('')
                setStatus('draft')
                setTags('')
                setStock('')
                setType('produto')
                setCommission('0')
                setExistingImages([])
                setFiles([])
                setPreviews([])

                // Reset location fields
                setIsNational(null)
                setLocationInfo('')
                setShowLocationFields(false)
              }
            }, [product])

            // Update showLocationFields when category changes
            useEffect(() => {
              const shouldShow = CATEGORIES_REQUIRING_LOCATION.includes(category)
              setShowLocationFields(shouldShow)

              // Reset location fields when hiding
              if (!shouldShow) {
                setIsNational(null)
                setLocationInfo('')
              }
            }, [category])

            function addFiles(list: FileList | null) {
              if (!list) return
              const arr = Array.from(list)
              // checks — consider already existing images plus new pending files
              if ((existingImages.length || 0) + files.length + arr.length > MAX_FILES) {
                setError(`Máximo ${MAX_FILES} imagens no total`); return
              }
              for (const f of arr) {
                if (!SUPPORTED_TYPES.includes(f.type)) { setError('Formato não permitido'); return }
                if (f.size > MAX_FILE_MB * 1024 * 1024) { setError(`Arquivo maior que ${MAX_FILE_MB}MB`); return }
              }
              const newFiles = [...files, ...arr]
              setFiles(newFiles)
              const newPreviews = newFiles.map(f => URL.createObjectURL(f))
              setPreviews(newPreviews)
              setError(null)
            }

            async function handleSubmit(e: React.FormEvent) {
              e.preventDefault()
              setError(null)
              setLoading(true)

              try {
                // Validate location fields for specific categories
                if (CATEGORIES_REQUIRING_LOCATION.includes(category)) {
                  if (isNational === null) {
                    setError('Por favor, informe se é nacional ou internacional.')
                    setLoading(false)
                    return
                  }
                  if (!locationInfo || locationInfo.trim() === '') {
                    setError(isNational
                      ? 'Por favor, selecione o estado.'
                      : 'Por favor, informe a localização internacional.')
                    setLoading(false)
                    return
                  }
                }

                const payload = {
                  title,
                  subtitle,
                  description,
                  price: Number(price || 0),
                  currency,
                  category,
                  status,
                  type,
                  tags: tags ? tags.split(',').map(t => t.trim()) : [],
                  stock: Number(stock || 0),
                  commission_percent: Number(commission || 0),
                  is_national: showLocationFields ? isNational : null,
                  location_info: showLocationFields ? locationInfo : null,
                  images: []
                }

                let id: string
                if (product) {
                  // Update existing product
                  const { error: updateError } = await supabase
                    .from('products')
                    .update(payload)
                    .eq('id', product.id)
                  if (updateError) {
                    setError(updateError.message)
                    setLoading(false)
                    return
                  }
                  id = product.id
                } else {
                  // Insert new product
                  const { data, error: insertError } = await supabase
                    .from('products')
                    .insert(payload)
                    .select('id')
                    .single()

                  if (insertError || !data?.id) {
                    if ((insertError as any)?.status === 409) {
                      setError('Conflito ao inserir produto (409). Provavelmente uma constraint única foi violada.')
                    } else {
                      setError(insertError?.message || 'Erro ao inserir produto')
                    }
                    setLoading(false)
                    return
                  }
                  id = data.id
                }

                const uploadedPaths: string[] = [...existingImages] // Keep existing images

                // Upload new files if any
                if (files.length > 0) {
                  const formData = new FormData()
                  formData.append('productId', id)
                  files.forEach(file => formData.append('files', file))

                  const uploadResponse = await fetch('/api/upload-images', {
                    method: 'POST',
                    body: formData,
                  })

                  if (!uploadResponse.ok) {
                    const uploadError = await uploadResponse.json()
                    setError(`Upload falhou: ${uploadError.error}`)
                    setLoading(false)
                    return
                  }

                  const uploadResult = await uploadResponse.json()
                  uploadedPaths.push(...uploadResult.urls)
                }

                // Update product with all images
                const { error: updateError } = await supabase
                  .from('products')
                  .update({ images: uploadedPaths })
                  .eq('id', id)
                if (updateError) {
                  setError(updateError.message)
                  setLoading(false)
                  return
                }

                // Reset form if creating new
                if (!product) {
                  setTitle('')
                  setSubtitle('')
                  setDescription('')
                  setPrice('0')
                  setCategory('')
                  setTags('')
                  setStock('')
                  setFiles([])
                  setPreviews([])
                  setExistingImages([])
                  setCommission('0')
                }

                setLoading(false)
                if (product && onUpdated) {
                  // Fetch updated product
                  const { data: updatedProduct } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', id)
                    .single()
                  if (updatedProduct) {
                    toast.success('✅ Produto atualizado com sucesso!', {
                      description: `"${title}" foi atualizado.`
                    })
                    onUpdated(updatedProduct as Product)
                  }
                } else if (onCreated) {
                  toast.success('🎉 Produto cadastrado com sucesso!', {
                    description: `"${title}" foi adicionado ao catálogo.`
                  })
                  onCreated()
                }
              } catch (err: any) {
                setError(err?.message || String(err))
                setLoading(false)
              }
            }

            function removeAt(i: number) {
              const copy = [...files]; copy.splice(i, 1); setFiles(copy)
              const prev = [...previews]; prev.splice(i, 1); setPreviews(prev)
            }

            function removeExistingImage(i: number) {
              const copy = [...existingImages]; copy.splice(i, 1); setExistingImages(copy)
            }

            return (
              <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow sm:max-w-3xl">
                {error && <div className="text-red-600">{error}</div>}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Título</label>
                    <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Subtítulo</label>
                    <input value={subtitle} onChange={e => setSubtitle(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Descrição</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded px-3 py-2 mt-1 min-h-[120px]" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="text-sm font-medium">Preço</label>
                    <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Moeda</label>
                    <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full border rounded px-3 py-2 mt-1">
                      <option value="BRL">BRL (Real Brasileiro)</option>
                      <option value="EUR">EUR (Euro)</option>
                      <option value="USD">USD (Dólar Americano)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tipo</label>
                    <select value={type} onChange={e => setType(e.target.value)} className="w-full border rounded px-3 py-2 mt-1">
                      <option value="produto">Produto</option>
                      <option value="oportunidade">Oportunidade</option>
                    </select>
                  </div>
                  {/* SKU removed - no longer collected */}
                  <div>
                    <label className="text-sm font-medium">Categoria</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border rounded px-3 py-2 mt-1">
                      <option value="">Selecione abaixo</option>
                      {AVAILABLE_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value)} className="w-full border rounded px-3 py-2 mt-1">
                      <option value="draft">Rascunho</option>
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                      <option value="archived">Arquivado</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Comissão (%)</label>
                    <input type="number" value={commission} onChange={e => setCommission(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
                  </div>
                </div>

                {showLocationFields && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm font-medium">Nacional?</label>
                      <select value={isNational === null ? '' : isNational ? '1' : '0'} onChange={e => setIsNational(e.target.value === '1')}
                        className="w-full border rounded px-3 py-2 mt-1"
                      >
                        <option value="">Selecione</option>
                        <option value="1">Sim</option>
                        <option value="0">Não</option>
                      </select>
                    </div>

                    {isNational && (
                      <div>
                        <label className="text-sm font-medium">Estado</label>
                        <select value={locationInfo} onChange={e => setLocationInfo(e.target.value)} className="w-full border rounded px-3 py-2 mt-1">
                          <option value="">Selecione</option>
                          {BRAZILIAN_STATES.map(s => (<option key={s.code} value={s.code}>{s.name}</option>))}
                        </select>
                      </div>
                    )}

                    {!isNational && (
                      <div>
                        <label className="text-sm font-medium">Localização (externo)</label>
                        <input value={locationInfo} onChange={e => setLocationInfo(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium">Tags (separadas por vírgula)</label>
                  <input value={tags} onChange={e => setTags(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
                </div>

                <div>
                  <label className="text-sm font-medium">Estoque</label>
                  <input type="number" value={stock === '' ? '' : String(stock)} onChange={e => setStock(e.target.value ? Number(e.target.value) : '')} className="w-full border rounded px-3 py-2 mt-1" />
                </div>

                <div>
                  <label className="text-sm font-medium">Imagens</label>
                  <div className="flex items-center gap-3 mt-2">
                    <input type="file" multiple onChange={(e) => addFiles(e.target.files)} />
                    {previews.length > 0 && <div className="text-xs text-slate-500">Pronto para enviar {previews.length} arquivo(s)</div>}
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {existingImages.map((img, i) => (
                      <div key={img} className="relative border rounded overflow-hidden h-24 bg-slate-50">
                        <img src={img} alt={`img-${i}`} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeExistingImage(i)} className="absolute right-1 top-1 text-xs px-2 py-1 bg-white/70 rounded">Remover</button>
                      </div>
                    ))}

                    {previews.map((img, i) => (
                      <div key={img} className="relative border rounded overflow-hidden h-24 bg-slate-50">
                        <img src={img} alt={`preview-${i}`} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeAt(i)} className="absolute right-1 top-1 text-xs px-2 py-1 bg-white/70 rounded">Remover</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button type="button" onClick={() => { onCancel?.(); }} className="px-4 py-2 rounded-md border">Cancelar</button>
                  <button className="px-4 py-2 rounded-md bg-gold-500 text-white" disabled={loading}>{loading ? 'Salvando...' : (product ? 'Atualizar' : 'Criar')}</button>
                </div>
              </form>
            )
          }

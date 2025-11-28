import React from 'react'

export default function BannerCarousel() {
  const slides = [
    { id: 1, title: 'Exclusividade', subtitle: 'Oportunidades selecionadas para membros' },
    { id: 2, title: 'Confiança', subtitle: 'Segurança e privacidade' },
    { id: 3, title: 'Serviço Premium', subtitle: 'Atendimento dedicado' }
  ]

  return (
    <div className="h-48 rounded-xl overflow-hidden bg-gradient-to-r from-navy-700 via-navy-800 to-navy-900 text-white p-6 flex items-center">
      <div className="max-w-2xl">
        {slides.map(s => (
          <div key={s.id} className="mb-4">
            <div className="text-xl font-semibold">{s.title}</div>
            <div className="text-sm text-slate-200">{s.subtitle}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

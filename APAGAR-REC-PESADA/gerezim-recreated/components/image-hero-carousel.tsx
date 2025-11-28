import React from 'react'

export default function ImageHeroCarousel({ slides }: { slides?: any[] }) {
  return (
    <div className="h-48 rounded-xl overflow-hidden bg-slate-900 text-white p-4 flex items-center">
      <div className="max-w-3xl">
        {slides?.map((s, idx) => (
          <div key={idx} className="mb-2">
            <div className="text-lg font-semibold">{s.title}</div>
            <div className="text-sm text-slate-300">{s.subtitle}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

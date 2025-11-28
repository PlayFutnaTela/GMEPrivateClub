import React from 'react'

export default function FooterSlider({ items }: { items?: string[] }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm overflow-hidden">
      <div className="flex gap-4 items-center">
        {(items ?? ['Trusted partners']).map((it) => (
          <div key={it} className="text-xs text-slate-600">{it}</div>
        ))}
      </div>
    </div>
  )
}

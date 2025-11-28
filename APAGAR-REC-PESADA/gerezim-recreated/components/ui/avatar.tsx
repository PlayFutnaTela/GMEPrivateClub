import React from 'react'

export function Avatar({ src, name, size = 40 }: { src?: string; name?: string; size?: number }) {
  const initials = name ? name.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase() : 'G'
  return (
    <div style={{ width: size, height: size }} className="rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-sm font-semibold text-slate-700">
      {src ? <img src={src} alt={name || 'avatar'} className="w-full h-full object-cover" /> : initials}
    </div>
  )
}

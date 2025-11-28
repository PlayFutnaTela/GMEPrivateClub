import React from 'react'

export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <div className="flex items-center gap-3">
      <div style={{ width: size, height: size }} className="rounded-full bg-gold-500 text-black flex items-center justify-center font-bold">G</div>
      <div className="leading-tight">
        <div className="font-title font-semibold">GEREZIM</div>
        <div className="text-xs text-slate-500">Private Club</div>
      </div>
    </div>
  )
}

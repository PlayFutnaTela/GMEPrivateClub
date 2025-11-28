"use client"
import React from 'react'

export default function ConciergeSidebar({ folders }: { folders?: any[] }) {
  return (
    <div className="bg-transparent h-full text-sm">
      <div className="mb-4 font-semibold">Pastas</div>
      <div className="space-y-2">
        {(folders ?? []).map((f) => (
          <div key={f.id} className="px-3 py-2 rounded-md hover:bg-white/5 cursor-pointer">{f.name}</div>
        ))}
      </div>
    </div>
  )
}

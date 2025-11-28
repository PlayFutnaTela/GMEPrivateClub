import React from 'react'

export default function HeroHover({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative group overflow-hidden rounded-xl shadow-lg">
      <div className="p-6 bg-white/5 group-hover:bg-white/10 transition">{children}</div>
    </div>
  )
}

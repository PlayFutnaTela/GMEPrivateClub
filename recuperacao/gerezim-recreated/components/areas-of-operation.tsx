import React from 'react'

export default function AreasOfOperation({ areas }: { areas?: string[] }) {
  return (
    <div className="space-y-2">
      {areas?.map((a) => (
        <div key={a} className="py-2 px-3 rounded-md bg-white/5">{a}</div>
      ))}
    </div>
  )
}

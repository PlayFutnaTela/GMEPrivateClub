import React from 'react'

export default function Sidebar() {
  return (
    <aside className="w-72 bg-navy-800 text-white rounded-xl p-4 shadow-inner">
      <div className="text-sm font-semibold mb-4">Navegação</div>
      <ul className="space-y-2 text-sm">
        <li className="py-2 px-3 rounded hover:bg-navy-700 cursor-pointer">Dashboard</li>
        <li className="py-2 px-3 rounded hover:bg-navy-700 cursor-pointer">Oportunidades</li>
        <li className="py-2 px-3 rounded hover:bg-navy-700 cursor-pointer">Concierge</li>
        <li className="py-2 px-3 rounded hover:bg-navy-700 cursor-pointer">Perfil</li>
      </ul>
    </aside>
  )
}

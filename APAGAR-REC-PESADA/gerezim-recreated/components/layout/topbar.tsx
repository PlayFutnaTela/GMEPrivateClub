import React from 'react'

export default function Topbar() {
  return (
    <div className="w-full flex items-center justify-between py-3">
      <div className="text-sm text-slate-600">Hoje • Bem-vindo</div>
      <div className="flex items-center gap-3">
        <div className="rounded-full w-9 h-9 bg-slate-100 flex items-center justify-center text-slate-700">A</div>
        <div className="text-sm text-slate-700 font-medium">Usuário</div>
      </div>
    </div>
  )
}

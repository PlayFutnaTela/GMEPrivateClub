import React from 'react'
import Link from 'next/link'

export default function BackButton({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="text-sm underline text-slate-500">← Voltar</Link>
  )
}

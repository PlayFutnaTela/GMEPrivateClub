"use client"
import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' }

export function Button({ className = '', variant = 'primary', ...props }: ButtonProps) {
  const base = 'inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition'
  const styles = variant === 'primary' ? 'bg-gold-500 text-white shadow' : 'bg-transparent border border-slate-200 text-slate-700'
  return <button className={`${base} ${styles} ${className}`} {...props} />
}

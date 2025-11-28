"use client"
import React from 'react'

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full border rounded-md px-3 py-2 ${props.className ?? ''}`} />
}

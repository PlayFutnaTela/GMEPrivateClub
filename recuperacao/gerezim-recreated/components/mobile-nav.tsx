"use client"
import React from 'react'
import Link from 'next/link'

export default function MobileNav() {
  return (
    <div className="lg:hidden p-2 bg-white/5 rounded-md">
      <div className="flex items-center justify-between">
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
      </div>
    </div>
  )
}

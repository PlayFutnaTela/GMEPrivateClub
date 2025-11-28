"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type TextRotateProps = {
  texts: string[]
  splitBy?: 'words' | 'chars'
  rotationInterval?: number
  className?: string
  initial?: any
  animate?: any
  exit?: any
}

export function TextRotate({
  texts = [],
  splitBy = 'words',
  rotationInterval = 3500,
  className = '',
  initial,
  animate,
  exit
}: TextRotateProps) {
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    if (!texts || texts.length <= 1) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % texts.length), rotationInterval)
    return () => clearInterval(timer)
  }, [texts, rotationInterval])

  const current = texts[index] || ''
  const parts = splitBy === 'chars' ? current.split('') : current.split(' ')

  return (
    <div className={`inline-block overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current + index}
          initial={initial ?? { y: '100%', opacity: 0 }}
          animate={animate ?? { y: 0, opacity: 1 }}
          exit={exit ?? { y: '-120%', opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="inline-block"
        >
          {parts.map((p, idx) => (
            <span key={idx} className="inline-block mr-1">
              {p}
            </span>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default TextRotate

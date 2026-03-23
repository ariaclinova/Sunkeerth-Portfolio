'use client'
import { useScrollRevealAll } from '@/lib/useScrollReveal'

export default function ScrollRevealProvider({ children }) {
  useScrollRevealAll()
  return <>{children}</>
}

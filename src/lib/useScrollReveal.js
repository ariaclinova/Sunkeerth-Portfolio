'use client'
import { useEffect } from 'react'

export function useScrollRevealAll(selector = '.reveal', threshold = 0.12) {
  useEffect(() => {
    let observer
    const timerId = setTimeout(() => {
      const elements = document.querySelectorAll(selector)
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold }
      )
      elements.forEach((el) => observer.observe(el))
    }, 60)

    return () => {
      clearTimeout(timerId)
      if (observer) observer.disconnect()
    }
  }, [selector, threshold])
}

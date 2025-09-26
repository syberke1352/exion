"use client"
import { useEffect, useRef } from "react"
import type React from "react"

interface GSAPAnimationsProps {
  children: React.ReactNode
}

export default function GSAPAnimations({ children }: GSAPAnimationsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Create floating geometric shapes
    const createFloatingShapes = () => {
      if (!containerRef.current) return

      const shapes = []
      for (let i = 0; i < 6; i++) {
        const shape = document.createElement("div")
        shape.className = "gsap-shape"
        shape.style.width = `${Math.random() * 60 + 20}px`
        shape.style.height = shape.style.width
        shape.style.left = `${Math.random() * 100}%`
        shape.style.top = `${Math.random() * 100}%`
        shape.style.animationDelay = `${Math.random() * 8}s`
        shape.style.opacity = "0.6"
        shape.style.zIndex = "1"

        containerRef.current.appendChild(shape)
        shapes.push(shape)
      }

      return () => {
        shapes.forEach((shape) => shape.remove())
      }
    }

    const cleanup = createFloatingShapes()

    // Scroll-triggered animations
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view")
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    })

    const animatedElements = document.querySelectorAll(".gsap-scroll-animate")
    animatedElements.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
      if (cleanup) cleanup()
    }
  }, [])

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {children}
    </div>
  )
}

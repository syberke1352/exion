"use client"
import { useEffect, useState, useRef } from "react"

interface AnimatedCharacterProps {
  type: "robotics" | "silat" | "futsal" | "music"
  isActive: boolean
}

export default function AnimatedCharacter({ type, isActive }: AnimatedCharacterProps) {
  const [scrollY, setScrollY] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const animationRef = useRef<number>()

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setMousePos({ x: e.clientX, y: e.clientY })
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const getCharacterElement = () => {
    const time = Date.now() * 0.001 // Convert to seconds for smoother animation
    const scrollProgress = scrollY * 0.001
    const mouseInfluence = {
      x: (mousePos.x - window.innerWidth / 2) * 0.02,
      y: (mousePos.y - window.innerHeight / 2) * 0.02,
    }

    const baseStyle = {
      position: "fixed" as const,
      zIndex: 10,
      pointerEvents: "none" as const,
      fontSize: "4rem",
      willChange: "transform, opacity",
      backfaceVisibility: "hidden" as const,
      perspective: "1000px",
    }

    switch (type) {
      case "robotics":
        return (
          <div
            className="smooth-character"
            style={{
              ...baseStyle,
              top: `${20 + Math.sin(time * 0.5) * 20 + scrollProgress * 50 + mouseInfluence.y}px`,
              right: `${20 + Math.cos(time * 0.3) * 80 + Math.sin(scrollProgress * 2) * 30 + mouseInfluence.x}px`,
              transform: `
                rotate(${Math.sin(time * 0.4) * 15 + scrollProgress * 20}deg) 
                scale(${1 + Math.sin(time * 0.6) * 0.1})
                rotateY(${Math.sin(time * 0.2) * 10}deg)
              `,
              filter: `hue-rotate(${Math.sin(time * 0.3) * 30}deg)`,
              opacity: 0.8 + Math.sin(time * 0.8) * 0.2,
            }}
          >
            🤖
          </div>
        )
      case "silat":
        return (
          <div
            className="smooth-character"
            style={{
              ...baseStyle,
              top: `${100 + Math.sin(time * 0.8) * 40 + scrollProgress * 30 + mouseInfluence.y}px`,
              left: `${30 + Math.cos(time * 0.6) * 60 + scrollProgress * 40 + mouseInfluence.x}px`,
              transform: `
                scaleX(${Math.sin(time * 0.5) > 0 ? 1 : -1}) 
                rotate(${Math.sin(time * 0.7) * 20}deg)
                translateZ(${Math.sin(time * 0.4) * 10}px)
              `,
              filter: `brightness(${1 + Math.sin(time * 0.5) * 0.2})`,
              opacity: 0.9 + Math.sin(time * 0.6) * 0.1,
            }}
          >
            🥋
          </div>
        )
      case "futsal":
        return (
          <div
            className="smooth-character"
            style={{
              ...baseStyle,
              bottom: `${50 + Math.abs(Math.sin(time * 1.2)) * 50 + scrollProgress * 20 + mouseInfluence.y}px`,
              left: `${Math.sin(time * 0.4) * 200 + 200 + scrollProgress * 100 + mouseInfluence.x}px`,
              transform: `
                rotate(${time * 50}deg) 
                scale(${1 + Math.sin(time * 1.5) * 0.15})
                perspective(500px) rotateX(${Math.sin(time * 0.3) * 15}deg)
              `,
              filter: `saturate(${1 + Math.sin(time * 0.8) * 0.3})`,
              opacity: 0.85 + Math.sin(time * 0.9) * 0.15,
            }}
          >
            ⚽
          </div>
        )
      case "music":
        return (
          <div
            className="smooth-character"
            style={{
              ...baseStyle,
              top: `${150 + Math.sin(time * 0.3) * 80 + scrollProgress * 60 + mouseInfluence.y}px`,
              right: `${100 + Math.cos(time * 0.4) * 50 + scrollProgress * 30 + mouseInfluence.x}px`,
              transform: `
                rotate(${Math.sin(time * 0.6) * 25}deg) 
                scale(${1 + Math.sin(time * 0.9) * 0.2})
                translateY(${Math.sin(time * 1.1) * 15}px)
              `,
              filter: `hue-rotate(${time * 20}deg)`,
              opacity: 0.7 + Math.sin(time * 0.7) * 0.3,
            }}
          >
            🎵
          </div>
        )
      default:
        return null
    }
  }

  return isActive ? getCharacterElement() : null
}

export function MultipleNotes({ isActive }: { isActive: boolean }) {
  const [scrollY, setScrollY] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setMousePos({ x: e.clientX, y: e.clientY })
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  if (!isActive) return null

  const notes = ["🎵", "🎶", "🎼", "🎤", "🎸", "🎹"]
  const time = Date.now() * 0.001
  const scrollProgress = scrollY * 0.001
  const mouseInfluence = {
    x: (mousePos.x - window.innerWidth / 2) * 0.01,
    y: (mousePos.y - window.innerHeight / 2) * 0.01,
  }

  return (
    <>
      {notes.map((note, index) => {
        const delay = index * 0.5
        const radius = 100 + Math.sin(time * 0.3 + delay) * 30
        const angle = time * 0.4 + index * ((Math.PI * 2) / notes.length)

        return (
          <div
            key={index}
            className="smooth-character"
            style={{
              position: "fixed",
              zIndex: 10,
              pointerEvents: "none",
              fontSize: `${1.5 + Math.sin(time * 0.8 + delay) * 0.5}rem`,
              willChange: "transform, opacity",
              backfaceVisibility: "hidden",
              top: `${300 + Math.sin(angle) * radius + scrollProgress * (20 + index * 10) + mouseInfluence.y}px`,
              right: `${200 + Math.cos(angle) * radius + scrollProgress * (15 + index * 5) + mouseInfluence.x}px`,
              transform: `
                rotate(${time * 30 + index * 60}deg) 
                scale(${1 + Math.sin(time * 1.2 + delay) * 0.3})
                perspective(800px) rotateY(${Math.sin(time * 0.5 + delay) * 20}deg)
              `,
              opacity: 0.4 + Math.sin(time * 0.6 + delay) * 0.4,
              filter: `hue-rotate(${time * 40 + index * 60}deg) brightness(${1 + Math.sin(time * 0.7 + delay) * 0.3})`,
            }}
          >
            {note}
          </div>
        )
      })}
    </>
  )
}

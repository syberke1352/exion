"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  life: number
  maxLife: number
}

export default function ScrollParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()
  const scrollYRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const handleScroll = () => {
      scrollYRef.current = window.scrollY
    }

    const createParticle = (x: number, y: number): Particle => {
      const colors = ["#06b6d4", "#0891b2", "#0e7490", "#155e75", "#164e63"]
      return {
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: Math.random() * 200 + 100,
      }
    }

    const updateParticles = () => {
      const scrollSpeed = Math.abs(scrollYRef.current - (scrollYRef.current || 0))

      // Create new particles based on scroll
      if (scrollSpeed > 1 && particlesRef.current.length < 50) {
        for (let i = 0; i < Math.min(3, Math.floor(scrollSpeed / 10)); i++) {
          particlesRef.current.push(createParticle(Math.random() * canvas.width, Math.random() * canvas.height))
        }
      }

      // Update existing particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life++

        // Fade out over time
        particle.opacity = Math.max(0, 1 - particle.life / particle.maxLife)

        // Add some drift based on scroll
        particle.x += Math.sin(scrollYRef.current * 0.01 + particle.life * 0.02) * 0.5
        particle.y += Math.cos(scrollYRef.current * 0.01 + particle.life * 0.02) * 0.5

        return particle.life < particle.maxLife && particle.opacity > 0
      })
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle) => {
        ctx.save()
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = particle.color
        ctx.shadowBlur = 10
        ctx.shadowColor = particle.color

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        // Draw connecting lines between nearby particles
        particlesRef.current.forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100 && distance > 0) {
            ctx.strokeStyle = particle.color
            ctx.globalAlpha = (1 - distance / 100) * particle.opacity * 0.3
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
          }
        })

        ctx.restore()
      })
    }

    const animate = () => {
      updateParticles()
      drawParticles()
      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("scroll", handleScroll)
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("scroll", handleScroll)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ mixBlendMode: "screen" }} />
}

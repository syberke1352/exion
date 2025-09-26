"use client"

import { useEffect, useRef, useState } from "react"

export default function RobotAnimation() {
  const robotRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [rotation, setRotation] = useState(0)
  const animationRef = useRef<number>()

  useEffect(() => {
    let time = 0

    const animate = () => {
      time += 0.02

      // Smooth orbital movement
      const centerX = 50
      const centerY = 50
      const radiusX = 30
      const radiusY = 20

      const newX = centerX + Math.cos(time) * radiusX
      const newY = centerY + Math.sin(time * 0.7) * radiusY
      const newRotation = time * 20

      setPosition({ x: newX, y: newY })
      setRotation(newRotation)

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      <div
        ref={robotRef}
        className="absolute transition-all duration-100 ease-out"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        }}
      >
        <div className="relative">
          {/* Robot Body */}
          <div className="w-16 h-20 bg-gradient-to-b from-gray-300 to-gray-500 rounded-lg shadow-lg relative">
            {/* Robot Head */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-b from-gray-200 to-gray-400 rounded-lg shadow-md">
              {/* Eyes */}
              <div className="absolute top-2 left-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              {/* Antenna */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-gray-600 rounded-full">
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              </div>
            </div>

            {/* Chest Panel */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-gray-700 rounded border-2 border-cyan-400">
              <div className="w-full h-1 bg-cyan-400 animate-pulse mt-1"></div>
              <div className="w-3/4 h-1 bg-cyan-300 animate-pulse mt-1 ml-1"></div>
            </div>

            {/* Arms */}
            <div className="absolute top-2 -left-4 w-3 h-8 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full shadow-md transform rotate-12 animate-bounce"></div>
            <div
              className="absolute top-2 -right-4 w-3 h-8 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full shadow-md transform -rotate-12 animate-bounce"
              style={{ animationDelay: "0.5s" }}
            ></div>

            {/* Legs */}
            <div className="absolute -bottom-6 left-2 w-3 h-8 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full shadow-md"></div>
            <div className="absolute -bottom-6 right-2 w-3 h-8 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full shadow-md"></div>

            {/* Feet */}
            <div className="absolute -bottom-8 left-1 w-5 h-3 bg-gray-800 rounded-full shadow-lg"></div>
            <div className="absolute -bottom-8 right-1 w-5 h-3 bg-gray-800 rounded-full shadow-lg"></div>
          </div>

          {/* Glow Effect */}
          <div className="absolute inset-0 bg-cyan-400 rounded-lg opacity-20 animate-pulse scale-110"></div>
        </div>
      </div>
    </div>
  )
}

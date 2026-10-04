'use client'

import { useEffect, useRef } from 'react'
import createGlobe from 'cobe'

export default function GlobeMount() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let phi = 0
    let globe: ReturnType<typeof createGlobe> | null = null
    let req: number

    if (canvasRef.current) {
      globe = createGlobe(canvasRef.current, {
        devicePixelRatio: 2,
        width: 600 * 2,
        height: 600 * 2,
        phi: 0,
        theta: 0.2,
        dark: 0,
        diffuse: 3.0,
        mapSamples: 30000,
        mapBrightness: 12.0,
        baseColor: [1, 1, 1],
        markerColor: [0.54, 0.19, 0.45],
        glowColor: [1, 1, 1],
        markers: [],
      })

      const animate = () => {
        if (!globe) return
        phi += 0.005
        globe.update({ phi })
        req = requestAnimationFrame(animate)
      }
      animate()
    }

    return () => {
      cancelAnimationFrame(req)
      globe?.destroy()
      console.log('globe destroyed')
    }
  }, [])

  return (
    <div style={{ width: '90vw', maxWidth: 600, aspectRatio: '1 / 1' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  )
}

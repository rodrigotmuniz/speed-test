/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'


let latencies: number[] = []
let socket: WebSocket

interface LatencyProps {
  ipAddress: string | null
  label: string
  open: boolean
  onCompleted: (status: boolean) => void
}

export function Latency({ ipAddress, label, open, onCompleted }: LatencyProps) {
  const [latency, setLatency] = useState(0)

  useEffect(() => {
    if (socket?.readyState !== 1) {
      socket = new WebSocket(`ws://${ipAddress}`)
    }
    
    socket.onopen = () => {
      latencies = []
      socket.send(JSON.stringify({ clientStartTime: performance.now() }))
    }

    socket.onmessage = (event) => {
      const endTime = performance.now()

      const { clientStartTime } = JSON.parse(event.data)
      if (open) {
        const currLatency = (endTime - clientStartTime) / 2
        latencies.push(currLatency)
        socket.send(JSON.stringify({ clientStartTime: performance.now() }))
      } else {
        socket.close()
        onCompleted(true)
      }
      setLatency(latencies.reduce((prev, curr) => prev + curr, 0) / latencies.length)
    }

    socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  }, [ipAddress, open])

  return (
    <p className="text-white">
      <strong>{label}:</strong> {latency ? latency.toFixed(2) : 0} ms
    </p>
  )
}

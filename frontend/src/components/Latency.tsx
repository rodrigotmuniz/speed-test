import { useEffect } from 'react'
// import { Button } from './Button'

let latencies: number[] = []
let socket: WebSocket

export function Latency({ ipAddress, latency, setLatency, speed, label }) {
  useEffect(() => {
    if (socket?.readyState !== 1) {
      socket = new WebSocket(`ws://${ipAddress}`)
    }

    socket.onopen = () => {
      socket.send(JSON.stringify({ clientStartTime: performance.now() }))
    }

    socket.onmessage = (event) => {
      const endTime = performance.now()

      const { clientStartTime } = JSON.parse(event.data)
      if (speed === 0) {
        const currLatency = (endTime - clientStartTime) / 2
        latencies.push(currLatency)
        socket.send(JSON.stringify({ clientStartTime: performance.now() }))
      } else {
        setLatency(latencies.reduce((prev, curr) => prev + curr, 0) / latencies.length)
        latencies = []
        socket.close()
      }
    }

    socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  }, [ipAddress, speed])

  return (
    <p className="text-white">
      <strong>{label}:</strong> {latency ? latency.toFixed(2) : 0} ms
    </p>
  )
}

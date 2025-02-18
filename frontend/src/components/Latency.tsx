import { useEffect } from 'react'
// import { Button } from './Button'

let latencies: number[] = []
let socket: WebSocket

export function Latency({ ipAddress, latency, setLatency, speed, label }) {
  useEffect(() => {
    socket = new WebSocket(`ws://${ipAddress}`)

    socket.onopen = () => {
      // const message = 'Hi server!'
      // socket.send(message)
      socket.send(JSON.stringify({ clientStartTime: performance.now() }))
    }

    socket.onmessage = (event) => {
      const endTime = performance.now()

      if (event.data === 'Hi Client') {
        console.log('Server said Hi')
      } else {
        const { clientStartTime } = JSON.parse(event.data)
        if (speed === 0) {
          const currLatency = (endTime - clientStartTime) / 2
          latencies.push(currLatency)
          console.log('latencies 2', speed)
          socket.send(JSON.stringify({ clientStartTime: performance.now() }))
        } else {
          setLatency(latencies.reduce((prev, curr) => prev + curr, 0) / latencies.length)
          console.log('length', latencies.length)
          latencies = []
        }
      }
    }

    socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  }, [ipAddress, speed])

  return <p className="text-white"><strong>{label}:</strong> {latency.toFixed(2)} ms</p>
}

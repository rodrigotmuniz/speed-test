import { useEffect } from 'react'

let latencies: number[] = []
let socket: WebSocket

export function Ping({ ipAddress, latency, setLatency }) {

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
        if (latencies.length < 9) {
          const currLatency = (endTime - clientStartTime) / 2
          latencies.push(currLatency)
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
  }, [ipAddress])

  return (
    <p className="text-white"><strong>Ping:</strong> {latency.toFixed(2)} ms</p>
  )
}

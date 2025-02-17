import { useState } from 'react'
import { Button } from './Button'

const socket = new WebSocket('ws://localhost:8080')
let latencies: number[] = []

export function Latency() {
  const [latency, setLatency] = useState(0)

  socket.onopen = () => {
    const message = 'Hi server!'
    socket.send(message)
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

  // socket.close()
  function sendMessage() {
    socket.send(JSON.stringify({ clientStartTime: performance.now() }))

    // const startTime = performance.now()
  }

  return (
    <div className='flex items-center justify-center'>
      <Button handleClick={sendMessage}>Latency</Button>
      <p className="text-white">{latency.toFixed(2)} ms</p>
    </div>
  )
}

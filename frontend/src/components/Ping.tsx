import { useState } from 'react'
import { Latency } from './Latency'

const PING_DURATION_MS = import.meta.env.VITE_PING_DURATION_MS

interface PingProps {
  ipAddress: string | null
  onPingCompleted: () => void
}

export function Ping({ ipAddress, onPingCompleted }: PingProps) {
  const [openSocket, setOpenSocket] = useState(true)

  setTimeout(() => {
    setOpenSocket(false)
  }, PING_DURATION_MS)

  return <Latency ipAddress={ipAddress} label="Ping Latency" open={openSocket} onCompleted={onPingCompleted} />
}

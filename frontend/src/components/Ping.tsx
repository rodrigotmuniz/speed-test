import { useState } from 'react'
import { Latency } from './Latency'

interface PingProps {
  ipAddress: string;
  onPingCompleted: () => void;
}

export function Ping({ ipAddress, onPingCompleted }: PingProps) {
  const [openSocket, setOpenSocket] = useState(true)

  setTimeout(() => {
    setOpenSocket(false)
  }, 2000)

  return <Latency ipAddress={ipAddress} label="Download Latency" open={openSocket} onCompleted={onPingCompleted} />
}

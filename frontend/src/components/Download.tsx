import { useEffect, useState } from 'react'
import { calculateSpeed } from '../utils'
import DownloadSpeedChart from './DownloadSpeedChart'
let concurrencyCounter: number = 0

export function Download({ ipAddress, downloadSpeed, setDownloadSpeed, payloadSize, concurrentRequests }) {
  // const [, setDownload] = useState(0)
  const [speedData, setSpeedData] = useState([])

  const requestDownload = async (payloadSize: number, startTime: number) => {
    // console.log(`http://${ipAddress}/download`)
    const response = await fetch(`http://${ipAddress}/download`, {
      cache: 'no-store',
    })
    await response.arrayBuffer()
    const end = performance.now() 
    concurrencyCounter++

    const speed = calculateSpeed(payloadSize, concurrencyCounter, end, startTime)
    // console.log(speed)

    const newEntry = { time: new Date().toLocaleTimeString(), speed } as never

    setSpeedData((prevData) => [...prevData, newEntry])
  }

  const handleDownloads = async (payloadSize: number, concurrentRequests: number) => {
    const start = performance.now()
    await Promise.all(Array.from({ length: concurrentRequests }, () => requestDownload(payloadSize, start)))
    const end = performance.now()

    const speed = (payloadSize * concurrentRequests * 8) / ((end - start) / 1000)
    // setDownload(speed)
    setDownloadSpeed(speed)
    concurrencyCounter = 0
  }

  useEffect(() => {
    handleDownloads(payloadSize, concurrentRequests)  
  }, [])

  return <div>
    <DownloadSpeedChart speedData={speedData} />
    <p className="text-white"><strong>Download Speed:</strong> {downloadSpeed.toFixed(0)} Mbps</p>
    </div>
}

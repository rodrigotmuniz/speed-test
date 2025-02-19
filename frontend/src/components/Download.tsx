import { useEffect, useState } from 'react'
import { calculateSpeed } from '../utils'
import DownloadSpeedChart from './DownloadSpeedChart'
import { Latency } from './Latency'

const BASE_FILE_SIZE_MB = 0.5 // Start small, adjust dynamically
const BASE_CONCURRENT_REQS = 4
const TIMEOUT_SEC = 20 // Maximum time permitted per group of request in seconds
const MAX_TIME_SPEND_SEC = 10 // Maximum time desired per group of request in seconds
const SCALE_FACTOR = 2 // Scale factor for file size adjustments

export function Download({ ipAddress, downloadSpeed, setDownloadSpeed, latency, setLatency }) {
  const [speedData, setSpeedData] = useState([])
  let speed = 0
  let concurrencyCounter: number = 0
  let fileSizeMb = BASE_FILE_SIZE_MB
  let concurrentRequests = BASE_CONCURRENT_REQS
  let attempts = 0

  const requestDownload = async (fileSizeMb: number, startTime: number, controller) => {
    const response = await fetch(`http://${ipAddress}/download/${fileSizeMb}`, {
      cache: 'no-store',
      signal: controller.signal,
    })
    await response.arrayBuffer()
    const endTime = performance.now()
    concurrencyCounter++

    speed = calculateSpeed(fileSizeMb, concurrencyCounter, endTime, startTime)

    const newEntry = { time: new Date().toLocaleTimeString(), speed } as never
    setSpeedData((prevData) => [...prevData, newEntry])
  }

  const handleDownloads = async () => {
    while (attempts < 7) {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_SEC * 1000)
      const startTime = performance.now()
      try {
        await Promise.all(Array.from({ length: concurrentRequests }, () => requestDownload(fileSizeMb, startTime, controller)))
      } catch (error) {
        console.warn('Download test interrupted or timed out.', error)
        break
      }
      const endTime = performance.now()

      clearTimeout(timeoutId)
      concurrencyCounter = 0

      const timeTakenSeconds = (endTime - startTime) / 1000
      if (timeTakenSeconds < MAX_TIME_SPEND_SEC) {
        fileSizeMb *= SCALE_FACTOR
        const concurrentFactor = (MAX_TIME_SPEND_SEC - timeTakenSeconds) / MAX_TIME_SPEND_SEC
        concurrentRequests *= (1 + concurrentFactor)
        console.log('concurrentRequests', concurrentRequests)
        attempts++
      } else {
        break
      }
    }
    setDownloadSpeed(speed)
  }

  useEffect(() => {
    handleDownloads()
  }, [])

  return (
    <div>
      <DownloadSpeedChart speedData={speedData} />
      <p className="text-white">
        <strong>Download Speed:</strong> {downloadSpeed?.toFixed(0)} Mbps
      </p>
      <Latency ipAddress={ipAddress} latency={latency} setLatency={setLatency} speed={downloadSpeed} label="Download Latency" />
    </div>
  )
}

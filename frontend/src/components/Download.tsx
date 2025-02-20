import { useEffect, useState } from 'react'
import { Latency } from './Latency'
import SpeedChart from './SpeedChart'

const DOWNLOAD_DURATION_MS = 15000
const MAX_CONCURRENT_REQUESTS = 4

interface DownloadProps {
  ipAddress: string | null
  onDownloadTestCompleted: () => void
}

export function Download({ ipAddress, onDownloadTestCompleted }: DownloadProps) {
  const [speedData, setSpeedData] = useState([])
  const [downloadSpeed, setDownloadSpeed] = useState(0)
  const [openSocket, setOpenSocket] = useState(true)

  let totalBytes = 0
  let startTime: number

  function calculateSpeed(endtTime: number) {
    const timeTakenSeconds = (endtTime - startTime) / 1000
    return (totalBytes * 8) / 1_000_000 / timeTakenSeconds
  }

  async function downloadChunk(controller: AbortController) {
    try {
      const response = await fetch(`http://${ipAddress}/download`, { signal: controller.signal })
      const reader = response.body!.getReader()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const endtTime = performance.now()
        totalBytes += value.length

        const downloadSpeed = calculateSpeed(endtTime)
        setDownloadSpeed(downloadSpeed)

        const newEntry = { time: new Date().toLocaleTimeString(), speed: +downloadSpeed.toFixed(2) } as never
        setSpeedData((prevData) => [...prevData, newEntry])
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Download error:', error)
      }
    }
  }

  async function startDownload(controller: AbortController) {
    if (controller.signal.aborted) return
    downloadChunk(controller).finally(() => {
      if (!controller.signal.aborted) {
        startDownload(controller)
      }
    })
  }

  async function handleDownloads() {
    setDownloadSpeed(0)

    const controller = new AbortController()
    setTimeout(() => {
      controller.abort()
      setOpenSocket(false)
      // setTimeout(() => {
      //   onDownloadTestCompleted(true)
      // }, 10)
    }, DOWNLOAD_DURATION_MS)

    startTime = performance.now()
    setOpenSocket(true)
    for (let i = 0; i < MAX_CONCURRENT_REQUESTS; i++) {
      startDownload(controller)
    }
  }

  useEffect(() => {
    handleDownloads()
  }, [])

  return (
    <div>
      <SpeedChart speedData={speedData} />
      <p className="text-white">
        <strong>Download Speed:</strong> {downloadSpeed?.toFixed(0)} Mbps
      </p>
      <Latency ipAddress={ipAddress} label="Download Latency" open={openSocket} onCompleted={onDownloadTestCompleted} />
    </div>
  )
}

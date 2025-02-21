import { useEffect, useState } from 'react'
import { SpeedChartProps } from './SpeedChart'
import { SpeedTest } from './SpeedTest'

const TEST_DURATION_MS = import.meta.env.VITE_TEST_DURATION_MS
const MAX_CONCURRENT_REQUESTS = import.meta.env.VITE_MAX_CONCURRENT_REQUESTS

interface DownloadProps {
  ipAddress: string | null
  onDownloadTestCompleted: () => void
}

export function Download({ ipAddress, onDownloadTestCompleted }: DownloadProps) {
  const [speedData, setSpeedData] = useState<SpeedChartProps['speedData']>([])
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

        const newEntry = { time: new Date().toLocaleTimeString(), speed: +downloadSpeed.toFixed(2) }
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
    }, TEST_DURATION_MS)

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
    <SpeedTest
      ipAddress={ipAddress}
      name="Download"
      onCompleted={onDownloadTestCompleted}
      openSocket={openSocket}
      speed={downloadSpeed}
      speedData={speedData}
    />
  )
}

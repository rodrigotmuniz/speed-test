import { useEffect, useState } from 'react'
import { Latency } from './Latency'
import SpeedChart, { SpeedChartProps } from './SpeedChart'

const UPLOAD_DURATION_MS = 15000
const MAX_CONCURRENT_REQUESTS = 4
const FILE_SIZE_MB = 25

const payload = new Blob([new ArrayBuffer(FILE_SIZE_MB * 1_000_000)])
const uploadCache = new Map()
let startTime: number
let requestId: number = 0

interface UploadProps {
  ipAddress: string | null
  onUploadTestCompleted: () => void
}

export function Upload({ ipAddress, onUploadTestCompleted }: UploadProps) {
  const [speedData, setSpeedData] = useState<SpeedChartProps['speedData']>([])
  const [uploadSpeed, setUploadSpeed] = useState(0)
  const [openSocket, setOpenSocket] = useState(true)

  function calculateSpeed(endTime: number) {
    const timeTakenSeconds = (endTime - startTime) / 1000
    const totalBits = [...uploadCache.values()].reduce((prev, curr) => prev + curr, 0)
    return (totalBits * 8) / 1_000_000 / timeTakenSeconds
  }

  async function uploadFile(controller: AbortController) {
    try {
      const id = ++requestId
      uploadCache.set(id, 0)

      const formData = new FormData()
      formData.append('file', payload)

      const xhr = new XMLHttpRequest()
      xhr.open('POST', `http://${ipAddress}/upload`, true)

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          uploadCache.set(id, event.loaded)

          const speed = calculateSpeed(performance.now())
          setUploadSpeed(speed)

          const newEntry = {
            time: new Date().toLocaleTimeString(),
            speed: +speed.toFixed(2),
          }
          setSpeedData((prevData) => [...prevData, newEntry])
        }
      }

      xhr.onloadend = () => {
        if (!controller.signal.aborted) {
          uploadFile(controller)
        }
      }

      xhr.onerror = () => controller.abort()

      controller.signal.addEventListener('abort', () => xhr.abort())

      xhr.send(formData)
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Upload error:', error)
        controller.abort()
      }
    }
  }

  async function startUpload(controller: AbortController) {
    if (controller.signal.aborted) return
    uploadFile(controller)
  }

  async function handleUploads() {
    setUploadSpeed(0)

    const controller = new AbortController()

    setTimeout(() => {
      controller.abort()
      setOpenSocket(false)
      uploadCache.clear()
      requestId = 0
    }, UPLOAD_DURATION_MS)

    startTime = performance.now()
    setOpenSocket(true)

    for (let i = 0; i < MAX_CONCURRENT_REQUESTS; i++) {
      startUpload(controller)
    }
  }

  useEffect(() => {
    handleUploads()
  }, [])

  return (
    <div>
      <SpeedChart speedData={speedData} />
      <p className="text-white">
        <strong>Upload Speed:</strong> {uploadSpeed?.toFixed(0)} Mbps
      </p>
      <Latency ipAddress={ipAddress} label="Upload Latency" open={openSocket} onCompleted={onUploadTestCompleted} />
    </div>
  )
}

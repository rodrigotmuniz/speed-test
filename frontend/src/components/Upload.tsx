import { useEffect, useState } from 'react'
import { calculateSpeed } from '../utils'
import DownloadSpeedChart from './DownloadSpeedChart'
let concurrencyCounter = 0
export function Upload({ ipAddress, uploadSpeed, setUploadSpeed, payloadSize, concurrentRequests }) {
  const [speedData, setSpeedData] = useState([])
  const handleUpload = async (payloadSize: number, concurrentRequests: number) => {
    const data = new Blob(['x'.repeat(payloadSize * 1000 * 1000)])
    const formData = new FormData()
    formData.append('file', data)

    const start = performance.now()
    await Promise.all(Array.from({ length: concurrentRequests }, () => requestUpload(formData, start)))
    const end = performance.now()

    const speed = (payloadSize * concurrentRequests * 8) / ((end - start) / 1000)
    setUploadSpeed(speed)
    concurrencyCounter = 0
  }

  const requestUpload = async (formData: FormData, startTime: number) => {
    await fetch(`http://${ipAddress}/upload`, { method: 'POST', body: formData })
    const end = performance.now()
    concurrencyCounter++

    const speed = calculateSpeed(payloadSize, concurrencyCounter, end, startTime)
    const newEntry = { time: new Date().toLocaleTimeString(), speed } as never

    setSpeedData((prevData) => [...prevData, newEntry])
  }

  useEffect(() => {
    handleUpload(payloadSize, concurrentRequests)
  }, [])

  return (
    <div>
      <DownloadSpeedChart speedData={speedData} />
      <p className="text-white"><strong>Upload Speed:</strong> {uploadSpeed.toFixed(0)} Mbps</p>
    </div>
  )
}

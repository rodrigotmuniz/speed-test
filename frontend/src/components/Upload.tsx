import { useState } from 'react'
import { Button } from './Button'
import DownloadSpeedChart from './DownloadSpeedChart'
import { calculateSpeed } from '../utils'

let parallelCounter = 0

export function Upload() {
  const [, setUpload] = useState(0)
  const [speedData, setSpeedData] = useState([])

  const handleUpload = async () => {
    const payloadSize = 25
    const concorrentRequests = 200

    const data = new Blob(['x'.repeat(payloadSize * 1024 * 1024)])
    const formData = new FormData()
    formData.append('file', data)

    const start = performance.now()
    await Promise.all(Array.from({ length: concorrentRequests }, () => requestUpload(payloadSize, start, formData)))
  }

  const requestUpload = async (payloadSize: number, startTime: number, formData: FormData) => {
    await fetch('http://localhost:8080/upload', { method: 'POST', body: formData })
    const end = performance.now()
    parallelCounter++

    const speed = calculateSpeed(payloadSize, parallelCounter, end, startTime)
    console.log(speed)
    setUpload(speed)

    const newEntry = { time: new Date().toLocaleTimeString(), speed } as never

    setSpeedData((prevData) => [...prevData, newEntry])
    parallelCounter = 0
  }

  const handlerCleanChart = () => {
    setSpeedData([])
  }

  return (
    <div className="mb-10">
      <DownloadSpeedChart speedData={speedData} />
      <div className="flex justify-center">
        <Button handleClick={handlerCleanChart}>Clean Chart</Button>
        <Button handleClick={handleUpload}>Upload</Button>
      </div>
    </div>
  )
}

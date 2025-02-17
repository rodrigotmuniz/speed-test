import { useState } from 'react'
import { Button } from './Button'
import DownloadSpeedChart from './DownloadSpeedChart'
import { calculateSpeed } from '../utils'

// let downloads: number[] = []
let parallelDownloadsCounter: number = 0

export function Download() {
  const [, setDownload] = useState(0)
  const [speedData, setSpeedData] = useState([])

  const requestDownload = async (payloadSize: number, startTime: number) => {
    const response = await fetch('http://localhost:8080/download', {
      cache: 'no-store',
    })
    await response.arrayBuffer()
    const end = performance.now() 
    parallelDownloadsCounter++

    const speed = calculateSpeed(payloadSize, parallelDownloadsCounter, end, startTime)
    console.log(speed)

    const newEntry = { time: new Date().toLocaleTimeString(), speed } as never

    setSpeedData((prevData) => [...prevData, newEntry])
  }

  const handleDownload = async () => {
    const payloadSize = 25
    const concorrentRequests = 200

    handlerParallel(payloadSize, concorrentRequests)
    // handlerSequential()
  }


  // const handlerSequential = async () => {
  //   if (downloads.length < 10) {
  //     const start = performance.now()
  //     const response = await fetch('http://localhost:8080/download', {
  //       cache: 'no-store',
  //     })
  //     await response.arrayBuffer()
  //     const end = performance.now()
  //     const speed = (25 * 8) / ((end - start) / 1000)
  //     downloads.push(speed)
  //     setDownload(() => speed)
  //     console.log('speed', speed)
  //     handleDownload()
  //   } else {
  //     const avgSpeed = downloads.reduce((prev, curr) => prev + curr, 0) / downloads.length
  //     setDownload(avgSpeed)
  //     downloads = []
  //   }
  // }

  const handlerParallel = async (payloadSize: number, concorrentRequests: number) => {
    const start = performance.now()
    await Promise.all(Array.from({ length: concorrentRequests }, () => requestDownload(payloadSize, start)))
    const end = performance.now()

    const speed = (payloadSize * concorrentRequests * 8) / ((end - start) / 1000)

    setDownload(speed)
    parallelDownloadsCounter = 0
  }

  const handlerCleanChart = () => {
    setSpeedData([])
  }

  return (
    <div className="mb-10">
      <DownloadSpeedChart speedData={speedData} />
      <div className="flex justify-center">
        <Button handleClick={handlerCleanChart}>Clean Chart</Button>
        <Button handleClick={handleDownload}>Download</Button>
      </div>
    </div>
  )
}

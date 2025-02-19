import { useState } from 'react'
import { Download } from './components/Download'
import { IpAddress } from './components/IpAddress'
// import { Latency } from './components/Latency'
import { Ping } from './components/Ping'
import { Upload } from './components/Upload'

function App() {
  const [ipAddress, setIpAddress] = useState(null)
  const [latency, setLatency] = useState(0)
  const [downloadSpeed, setDownloadSpeed] = useState(0)
  const [downloadLatency, setDownloadLatency] = useState(0)
  const [uploadSpeed, setUploadSpeed] = useState(0)
  const [uploadLatency, setUploadLatency] = useState(0)

  const clean = () => {
    setIpAddress(null)
    setLatency(0)
    setDownloadSpeed(0)
    setDownloadLatency(0)
    setUploadSpeed(0)
    setUploadLatency(0)
  }

  const payloadSize = 10
  const concurrentRequests = 4

  // console.log('ipAddress', ipAddress, payloadSize, concurrentRequests)  
  return (
    <div className="mx-10  p-2">
      <IpAddress setIpAddress={setIpAddress} clean={clean} />
      {ipAddress && (
        <div className="p-2 my-2 border-2 border-solid">
          <Ping ipAddress={ipAddress} latency={latency} setLatency={setLatency} />
        </div>
      )}
      {latency !== 0 && (
        <div className="p-2 my-2 border-2 border-solid">
          <Download
            ipAddress={ipAddress}
            downloadSpeed={downloadSpeed}
            setDownloadSpeed={setDownloadSpeed}
            latency={downloadLatency}
            setLatency={setDownloadLatency}
            // payloadSize={payloadSize}
            // concurrentRequests={concurrentRequests}
          />
          {/* <Latency
            ipAddress={ipAddress}
            latency={downloadLatency}
            setLatency={setDownloadLatency}
            speed={downloadSpeed}
            label="Download Latency"
          /> */}
        </div>
      )}
      {/* {downloadLatency !== 0 && (
        <div className="p-2 my-2 border-2 border-solid">
          <Upload
            ipAddress={ipAddress}
            uploadSpeed={uploadSpeed}
            setUploadSpeed={setUploadSpeed}
            payloadSize={payloadSize}
            concurrentRequests={concurrentRequests}
          />
          <Latency ipAddress={ipAddress} latency={uploadLatency} setLatency={setUploadLatency} speed={uploadSpeed} label="Upload Latency" />
        </div>
      )} */}
    </div>
  )
}

export default App

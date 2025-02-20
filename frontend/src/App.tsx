import { SetStateAction, useState } from 'react'
import { Download } from './components/Download'
import { IpAddress } from './components/IpAddress'
import { Ping } from './components/Ping'
import { Upload } from './components/Upload'

function App() {
  const [ipAddress, setIpAddress] = useState<string | null>(null)

  const [isPingCompleted, setIsPingCompleted] = useState(false)
  const [isDownloadTestCompleted, setIsDownloadTestCompleted] = useState(false)
  const [, setIsUploadTestCompleted] = useState(false)

  const handleClean = () => {
    setIpAddress(null)

    setIsPingCompleted(false)
    setIsDownloadTestCompleted(false)
  }

  const handleIpAddress = (ipAddress: SetStateAction<string | null>) => setIpAddress(ipAddress)
  const handlePingCompleted = () => setIsPingCompleted(true)
  const handleDownloadTestCompleted = () => setIsDownloadTestCompleted(true)
  const handleUploadTestCompleted = () => setIsUploadTestCompleted(true)

  return (
    <div className="mx-10  p-2">
      <IpAddress onClean={handleClean} onIpAddressChange={handleIpAddress} />
      {ipAddress && (
        <div className="p-2 my-2 border-2 border-solid">
          <Ping ipAddress={ipAddress} onPingCompleted={handlePingCompleted} />
          {/* <Latency ipAddress={ipAddress} label="Ping" open={true} onCompleted={setIsPingCompleted} /> */}
        </div>
      )}
      {isPingCompleted && (
        <div className="p-2 my-2 border-2 border-solid">
          <Download ipAddress={ipAddress} onDownloadTestCompleted={handleDownloadTestCompleted} />
        </div>
      )}
      {isDownloadTestCompleted  && (
        <div className="p-2 my-2 border-2 border-solid">
          <Upload ipAddress={ipAddress} onUploadTestCompleted={handleUploadTestCompleted} />
        </div>
      )}
    </div>
  )
}

export default App

import { SetStateAction, useState } from 'react'
import { Card } from './components/Card'
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

      <Card show={!!ipAddress}>
        <Ping ipAddress={ipAddress} onPingCompleted={handlePingCompleted} />
      </Card>

      <Card show={isPingCompleted}>
        <Download ipAddress={ipAddress} onDownloadTestCompleted={handleDownloadTestCompleted} />
      </Card>

      <Card show={isDownloadTestCompleted}>
        <Upload ipAddress={ipAddress} onUploadTestCompleted={handleUploadTestCompleted} />
      </Card>
    </div>
  )
}

export default App

import { Download } from './components/Download'
import { Latency } from './components/Latency'
import { Upload } from './components/Upload'

function App() {
  return (
    <div className="m-10  p-2">
      <Download />
      <Upload />
      <Latency /> 
    </div> 
  )
}
 
export default App

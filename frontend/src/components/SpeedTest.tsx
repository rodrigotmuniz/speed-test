import ReactSpeedometer, { Transition } from 'react-d3-speedometer'
import { Latency } from './Latency'
import SpeedChart, { SpeedChartProps } from './SpeedChart'

interface SpeedTestProps {
  speed: number
  name: 'Download' | 'Upload'
  ipAddress: string | null
  openSocket: boolean
  onCompleted: () => void
  speedData: SpeedChartProps['speedData']
}

export function SpeedTest({ speed, name, ipAddress, openSocket, onCompleted, speedData }: SpeedTestProps) {
  return (
    <div className="relative">
      <div className="flex gap-4">
        <div className="flex">
          <ReactSpeedometer
            maxValue={100}
            value={speed < 100 ? speed : 100}
            needleColor="DarkGrey"
            startColor="red"
            segments={10}
            endColor="green"
            currentValueText={`${name} Speed: ${speed?.toFixed(0)} Mbps`}
            height={180}
            width={300}
            needleTransition={Transition.easeElastic}
          />
        </div>

        <div className="absolute bottom-5 right-2 bg-white p-2 rounded-lg shadow-lg">
          <Latency ipAddress={ipAddress} label={`${name} Latency`} open={openSocket} onCompleted={onCompleted} />
        </div>

        <SpeedChart speedData={speedData} name={name} />
      </div>
    </div>
  )
}

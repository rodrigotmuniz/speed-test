import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts'

export interface SpeedChartProps {
  speedData: { time: string; speed: number }[]
  name: 'Download' | 'Upload'
}

const SpeedChart = ({ speedData, name }: SpeedChartProps) => {
  return (
    <ResponsiveContainer className=" bg-amber-50 mb-2" width="100%" height={180} style={{ paddingLeft: '10px', backgroundColor: 'black' }}>
      <LineChart data={speedData} style={{ color: 'red', textColor: 'red' }}>
        <YAxis label={{ value: 'Mbps', angle: -90, position: 'insideLeft' }} />
        <Line type="basis" dataKey="speed" dot={false} stroke={name === 'Download' ? 'green' : 'red'} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default SpeedChart

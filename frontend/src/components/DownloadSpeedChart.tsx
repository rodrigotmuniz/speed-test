import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const DownloadSpeedChart = ({ speedData }) => {
  return (
    <ResponsiveContainer className=' bg-amber-50 mb-2' width="100%" height={300}>
      <LineChart data={speedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis label={{ value: "Mbps", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        {/* <Legend /> */}
        <Line type="monotone" dataKey="speed" stroke="#8884d8"  />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DownloadSpeedChart;

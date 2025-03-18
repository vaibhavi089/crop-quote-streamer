
import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CropPriceData } from "@/types";

interface PriceChartProps {
  data: CropPriceData[];
  height?: number;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, height = 200 }) => {
  // Prepare data for chart
  const chartData = data.map((item) => ({
    date: item.date.toLocaleDateString(),
    min: item.minPrice,
    max: item.maxPrice,
    modal: item.modalPrice,
  }));

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="min" stackId="1" stroke="#8884d8" fill="#8884d8" />
          <Area type="monotone" dataKey="modal" stackId="2" stroke="#4CAF50" fill="#4CAF50" />
          <Area type="monotone" dataKey="max" stackId="3" stroke="#82ca9d" fill="#82ca9d" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;

'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

type PositionChartProps = {
  data: Array<{
    position: string;
    count: number;
  }>;
};

export default function PositionChart({ data }: PositionChartProps) {
  // Sort data by count in descending order
  const sortedData = [...data].sort((a, b) => b.count - a.count);
  
  // Calculate dynamic height based on number of positions (minimum 400px)
  const height = Math.max(400, sortedData.length * 40);
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart 
        data={sortedData} 
        layout="vertical" 
        margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis 
          type="category" 
          dataKey="position" 
          tick={{ 
            fontSize: 12,
            width: 140,
            wordWrap: 'break-word'
          }} 
          width={140}
        />
        <Tooltip 
          formatter={(value) => [`${value} applicants`, 'Count']}
          labelFormatter={(label) => `Position: ${label}`}
        />
        <Bar 
          dataKey="count" 
          fill="#3B82F6" 
          name="Applicants"
          barSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
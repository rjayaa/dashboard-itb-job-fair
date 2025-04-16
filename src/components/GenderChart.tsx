'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

type GenderChartProps = {
  data: Array<{
    name: string;
    value: number;
  }>;
};

export default function GenderChart({ data }: GenderChartProps) {
  const COLORS = ['#3B82F6', '#EC4899', '#10B981'];
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} aplicantes`, 'Cantidad']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
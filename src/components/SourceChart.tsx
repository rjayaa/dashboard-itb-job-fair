'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type SourceChartProps = {
  data: Array<{
    name: string;
    value: number;
  }>;
};

export default function SourceChart({ data }: SourceChartProps) {
  // Sort data by value in descending order
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={sortedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip 
          formatter={(value) => [`${value} applicants`, 'Count']}
          labelFormatter={(label) => `Source: ${label}`}
        />
        <Bar dataKey="value" fill="#F59E0B" name="Aplicantes" />
      </BarChart>
    </ResponsiveContainer>
  );
}
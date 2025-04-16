'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type DailyTrendChartProps = {
  data: Array<{
    date: string;
    count: number;
  }>;
};

export default function DailyTrendChart({ data }: DailyTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip 
          formatter={(value) => [`${value} applicants`, 'Count']}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Line type="monotone" dataKey="count" stroke="#3B82F6" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
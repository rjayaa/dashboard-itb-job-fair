'use client';

import { useState, useEffect } from 'react';
import DateRangePicker from '@/components/DateRangePicker';
import StatCard from '@/components/StatCard';
import PositionChart from '@/components/PositionChart';
import GenderChart from '@/components/GenderChart';
import EducationChart from '@/components/EducationChart';
import SourceChart from '@/components/SourceChart';
import DailyTrendChart from '@/components/DailyTrendChart';

export default function Dashboard() {
  const [startDate, setStartDate] = useState<Date>(new Date('2025-04-08'));
  const [endDate, setEndDate] = useState<Date>(new Date('2025-04-15'));
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/jobfair?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  const handleDateChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">ITB Bandung Job Fair Dashboard</h1>
        <p className="text-gray-600">
          Candidate and position analysis from {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
        </p>
      </div>

      <div className="mb-6">
        <DateRangePicker 
          startDate={startDate} 
          endDate={endDate} 
          onChange={handleDateChange} 
          minDate={new Date('2025-04-01')}
          maxDate={new Date('2025-04-30')}
        />
      </div>

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Total Applications" 
              value={data.totalApplications} 
              icon="📝" 
            />
            <StatCard 
              title="Available Positions" 
              value={data.uniquePositions} 
              icon="💼" 
            />
            <StatCard 
              title="M/F Ratio" 
              value={`${data.genderRatio.toFixed(2)}:1`}
              icon="⚖️" 
            />
            <StatCard 
              title="Main Source" 
              value={data.topSource} 
              icon="📱" 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Applications by Position</h2>
              <PositionChart data={data.positionData} />
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Gender Distribution</h2>
              <GenderChart data={data.genderData} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Education Level</h2>
              <EducationChart data={data.educationData} />
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Application Sources</h2>
              <SourceChart data={data.sourceData} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Daily Application Trend</h2>
            <DailyTrendChart data={data.dailyTrendData} />
          </div>
        </>
      )}
    </div>
  );
}
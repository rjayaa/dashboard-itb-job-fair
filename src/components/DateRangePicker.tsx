// components/DateRangePicker.tsx
'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type DateRangePickerProps = {
  startDate: Date;
  endDate: Date;
  onChange: (start: Date, end: Date) => void;
  minDate?: Date;
  maxDate?: Date;
};

export default function DateRangePicker({ 
  startDate, 
  endDate, 
  onChange,
  minDate,
  maxDate 
}: DateRangePickerProps) {
  const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);

  const handleStartDateChange = (date: Date) => {
    if (date > endDate) {
      onChange(date, date);
    } else {
      onChange(date, endDate);
    }
    setFocusedInput('endDate');
  };

  const handleEndDateChange = (date: Date) => {
    onChange(startDate, date);
    setFocusedInput(null);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center p-4 bg-white rounded-lg shadow">
      <div className="font-medium">Date Range:</div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            minDate={minDate}
            maxDate={maxDate}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            dateFormat="dd/MM/yyyy"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            maxDate={maxDate}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            dateFormat="dd/MM/yyyy"
          />
        </div>
      </div>
    </div>
  );
}

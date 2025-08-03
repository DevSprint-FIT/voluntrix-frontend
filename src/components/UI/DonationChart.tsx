import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronDown } from 'lucide-react';

interface DonationsChartProps {
  data?: Array<{
    month: string;
    amount: number;
    label: string;
  }>;
  loading?: boolean;
  onYearChange?: (year: number) => void;
}

const DonationsChart: React.FC<DonationsChartProps> = ({ 
  data = [], 
  loading = false,
  onYearChange 
}) => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  
  const availableYears = [2023, 2024, 2025, 2026];

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setIsYearDropdownOpen(false);
    onYearChange?.(year);
  };

  // Generate fallback data for recent months when no data is available
  const generateFallbackData = () => {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();
    
    // Get last 3 months including current month
    const recentMonths = [];
    for (let i = 2; i >= 0; i--) {
      const monthIndex = (currentMonthIndex - i + 12) % 12;
      recentMonths.push({
        month: months[monthIndex],
        amount: 0,
        label: months[monthIndex]
      });
    }
    
    return recentMonths;
  };

  // Use actual data if available, otherwise use fallback data
  const chartData = data && data.length > 0 ? data : generateFallbackData();

  // Custom tooltip component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-900">
            {label}
          </p>
          <p className="text-sm text-gray-600">
            Amount: <span className="font-semibold text-green-600">LKR {payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate total amount (sum of all months) and percentage change
  const totalAmount = chartData.reduce((sum, item) => sum + item.amount, 0);
  const currentMonthAmount = chartData.length > 0 ? chartData[chartData.length - 1]?.amount || 0 : 0;
  const previousMonthAmount = chartData.length > 1 ? chartData[chartData.length - 2]?.amount || 0 : 0;
  const percentageChange = previousMonthAmount > 0 
    ? ((currentMonthAmount - previousMonthAmount) / previousMonthAmount * 100).toFixed(0)
    : 0;

  if (loading) {
    return (
      <div className="bg-[#FBFBFB] rounded-xl p-4 h-48">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/6 mb-4"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FBFBFB] rounded-xl p-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          {/* Year Selector */}
          <div className="relative mb-1 pl-4 pt-2">
            <button
              onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
              className="flex items-center gap-2 text-shark-900 text-sm hover:text-shark-700 transition-colors bg-shark-50 px-3 py-2 rounded-full"
            >
              {selectedYear}
              <ChevronDown size={14} className={`transition-transform ${isYearDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Dropdown */}
            {isYearDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[80px]">
                {availableYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearChange(year)}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                      year === selectedYear ? 'bg-green-50 text-green-600' : 'text-gray-700'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Amount on first line - Show total amount */}
          <div className="text-xl pl-4 font-bold text-gray-900 mb-1">
            LKR {totalAmount.toLocaleString()}
          </div>
          
          {/* Percentage on second line */}
          <div className="text-sm text-gray-500 mb-3 pl-4">
            Total Donations  
            {data && data.length > 0 ? (
              <span className="text-green-600 ml-1">
                {previousMonthAmount > 0 ? `${Number(percentageChange) >= 0 ? '+' : ''}${percentageChange}%` : 'N/A'}
              </span>
            ) : (
              <span className="text-gray-400 ml-1">No donations yet</span>
            )}
          </div>
        </div>
      </div>

      {/* Chart positioned to the right */}
      <div className="h-32 ml-auto pt-0 pr-12 pb-6" style={{ width: '70%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#10B981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DonationsChart;
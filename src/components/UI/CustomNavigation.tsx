import React, { useState, useRef, useEffect } from 'react';

// Define the props interface
interface CustomNavigationProps {
  date: Date;
  onNavigate: (date: Date) => void;
}

const CustomNavigation: React.FC<CustomNavigationProps> = ({ date, onNavigate }) => {
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Generate year options from current year to bottom (descending order)
  const yearOptions = [];
  
  // Start from current year and go down to past years
  for (let i = currentYear; i >= currentYear - 10; i--) {
    yearOptions.push(i);
  }
  
  // Add future years after current year
  for (let i = currentYear + 1; i <= currentYear + 10; i++) {
    yearOptions.push(i);
  }
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsYearDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleMonthChange = (direction: number) => {
    const newDate = new Date(date);
    newDate.setMonth(currentMonth + direction);
    onNavigate(newDate);
  };
  
  const handleYearSelect = (year: number) => {
    const newDate = new Date(date);
    newDate.setFullYear(year);
    onNavigate(newDate);
    setIsYearDropdownOpen(false);
  };
  
  return (
    <div className="flex items-center justify-between mb-4">
      <button 
        onClick={() => handleMonthChange(-1)}
        className="p-1 hover:bg-verdant-200 rounded"
      >
        &lt;
      </button>
      
      <div className="flex items-center gap-2">
        <span className="bg-verdant-50 text-verdant-500 px-3 py-1 rounded-full font-semibold">
          {monthNames[currentMonth]}
        </span>
        
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
            className="bg-shark-50 text-shark-800 px-3 py-1 rounded-full font-semibold cursor-pointer flex items-center gap-2"
          >
            {currentYear}
            <svg 
              width="12" 
              height="12" 
              viewBox="0 0 12 12" 
              fill="none"
              className={`transition-transform duration-200 ${isYearDropdownOpen ? 'rotate-180' : ''}`}
            >
              <path d="M3 4.5L6 7.5L9 4.5" stroke="#A3AED0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {isYearDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
              {yearOptions.map(year => (
                <button
                  key={year}
                  onClick={() => handleYearSelect(year)}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors ${
                    year === currentYear ? 'bg-verdant-50 text-verdant-600 font-semibold' : 'text-shark-800'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <button 
        onClick={() => handleMonthChange(1)}
        className="p-1 hover:bg-verdant-200 rounded"
      >
        &gt;
      </button>
    </div>
  );
};

export default CustomNavigation;
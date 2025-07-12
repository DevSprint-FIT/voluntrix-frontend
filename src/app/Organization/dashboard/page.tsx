"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css'; 
import "@/app/styles/calendar.css"      
import FollowersPieChart from "@/components/UI/FollowersPieChart";    
import DonationsChart from "@/components/UI/DonationChart";
import FollowersChart from "@/components/UI/FollowersChart";
import CustomNavigation from "@/components/UI/CustomNavigation"; 

import StatCard from "@/components/UI/StatCard";
import { BarChart } from "lucide-react";

import { getEventDataForOrganization, getFollowersStatsByOrganizationId, FollowersData, getInstituteDistributionByOrganizationId } from "@/services/dashboardService";
import { getOrganizationSettingsByUsername, OrganizationSettings } from "@/services/organizationSettingsService";

interface TileProps {
  date: Date;
  view: string;
}

interface DonationData {
  month: string;
  amount: number;
  label: string;
}

interface FollowersChartData {
  month: string;
  count: number;
  label: string;
}

type InstituteData = {
  name: string;
  value: number;
};

export default function DashboardPage() {
  const [value, setValue] = useState(new Date());
  const [eventDates, setEventDates] = useState<Date[]>([]);
  const [donationsData, setDonationsData] = useState<DonationData[]>([]);
  const [donationsLoading, setDonationsLoading] = useState(false);
  const [followersDataLineGraph, setFollowersDataLineGraph] = useState<FollowersChartData[]>([]);
  const [followersLoading, setFollowersLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [followersThisMonth, setFollowersThisMonth] = useState<number>(0);
  const [totalEventsHosted, setTotalEventsHosted] = useState<number>(0);
  const [organization, setOrganization] = useState<OrganizationSettings | null>(null);

  const username = "IEEESLIT";

  const onChangeHandler = (
    value: Date | [Date | null, Date | null] | null,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (value instanceof Date) {
      setValue(value);
    } else if (Array.isArray(value) && value[0] instanceof Date) {
      setValue(value[0]);
    }
  };

  const [instituteData, setInstituteData] = useState<InstituteData[]>([]);

  const fetchInstituteDistribution = async (organizationId: number) => {
    try {
      const data = await getInstituteDistributionByOrganizationId(organizationId);
      const formatted: InstituteData[] = Object.entries(data).map(([name, value]) => ({
        name,
        value,
      }));
      setInstituteData(formatted);
    } catch (err) {
      console.error("Error fetching institute distribution:", err);
      setInstituteData([]);
    }
  };

  const fetchFollowersData = async (organizationId: number, year: number) => {
  setFollowersLoading(true);
  try {
    const data: FollowersData[] = await getFollowersStatsByOrganizationId(organizationId, year);

    const formattedData: FollowersChartData[] = data.map(item => ({
      month: item.month,
      count: item.count,
      label: item.month
    }));
    setFollowersDataLineGraph(formattedData);

    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    const currentMonthData = data.find(d => d.month === currentMonth);
    setFollowersThisMonth(currentMonthData ? currentMonthData.count : 0);

  } catch (error) {
    console.error("Error fetching followers data:", error);
    setFollowersDataLineGraph([]);
    setFollowersThisMonth(0);
  } finally {
    setFollowersLoading(false);
  }
};


 useEffect(() => {
  async function fetchEventData() {
    try {
      const organizationId = 1; 
      
      const { eventCount, eventDates } = await getEventDataForOrganization(organizationId);
      
      setEventDates(eventDates);
      setTotalEventsHosted(eventCount); 
      
      console.log(`Organization ${organizationId} has ${eventCount} events`);
    } catch (err) {
      console.error("Error fetching event data:", err);
    }
  }

  async function fetchOrganizationData() {
    try {
      const data = await getOrganizationSettingsByUsername(username);
      setOrganization(data);
    } catch (error) {
      console.error("Failed to fetch organization", error);
    }
  }
  
  fetchEventData();
  fetchOrganizationData();
  fetchInstituteDistribution(1);
  fetchDonationsData(1, selectedYear);
  fetchFollowersData(1, selectedYear);
}, [selectedYear]);

  
  const fetchDonationsData = async (organizationId: number, year: number) => {
    setDonationsLoading(true);
    try {
      
      setTimeout(() => {
        
        const yearData: Record<number, DonationData[]> = {
          2023: [
            { month: 'JAN', amount: 2800, label: 'Jan' },
            { month: 'FEB', amount: 3200, label: 'Feb' },
            { month: 'MAR', amount: 2900, label: 'Mar' },
            { month: 'APR', amount: 3500, label: 'Apr' },
            { month: 'MAY', amount: 4100, label: 'May' },
            { month: 'JUN', amount: 3800, label: 'Jun' },
          ],
          2024: [
            { month: 'JAN', amount: 3500, label: 'Jan' },
            { month: 'FEB', amount: 4200, label: 'Feb' },
            { month: 'MAR', amount: 3800, label: 'Mar' },
            { month: 'APR', amount: 4600, label: 'Apr' },
            { month: 'MAY', amount: 5200, label: 'May' },
            { month: 'JUN', amount: 4800, label: 'Jun' },
          ],
          2025: [
            { month: 'SEP', amount: 3200, label: 'Sep' },
            { month: 'OCT', amount: 2800, label: 'Oct' },
            { month: 'NOV', amount: 5000, label: 'Nov' },
            { month: 'DEC', amount: 2400, label: 'Dec' },
            { month: 'JAN', amount: 4800, label: 'Jan' },
            { month: 'FEB', amount: 4600, label: 'Feb' },
          ],
        };
        
        setDonationsData(yearData[year] || []);
        setDonationsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching donations data:", error);
      setDonationsLoading(false);
    }
  };

  
  
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    fetchDonationsData(1, year); 
    fetchFollowersData(1, year); 
  };

  const handleFollowersYearChange = (year: number) => {
    setSelectedYear(year);
    fetchFollowersData(1, year); 
  };

  const tileClassName = ({ date, view }: TileProps) => {
    if (view === 'month') {
      return eventDates.some(ed =>
        ed.getFullYear() === date.getFullYear() &&
        ed.getMonth() === date.getMonth() &&
        ed.getDate() === date.getDate()
      ) ? "highlight-event" : undefined;
    }
    return undefined;
  };

  return (
    <div className="p-5 m-5">
      {/* Title with Organization Info */}
      <div className="flex justify-between items-center mb-6">
        {/* Left Side: Title */}
        <div>
          <span className="text-shark-300">Organization / Dashboard</span>
          <h1 className="text-2xl font-primary font-bold mt-1">Main Dashboard</h1>
        </div>

        {/* Right Side: Organization Info */}
        <div className="flex items-center gap-3">
          <img
            src={organization?.imageUrl} 
            alt="Organization Logo"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="font-semibold font-secondary text-xl leading-tight">{organization?.name}</h2> 
            <p className="font-secondary font-semibold text-shark-600 text-xs leading-tight">{organization?.institute}</p>       
          </div>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="flex flex-wrap gap-10 mb-8">
        <StatCard title="Total Events Hosted" value={totalEventsHosted} icon={<BarChart size={20} />} />
        <StatCard title="This Month Donations" value="LKR 4,500" icon={<BarChart size={20} />} />
        <StatCard title="This Month Followers" value={followersThisMonth} icon={<BarChart size={20} />} />
        <StatCard title="Total Views" value={200} icon={<BarChart size={20} />} />
      </div>

      {/* Calendar + Graph Section */}
      <div className="flex gap-8 mb-8">
        {/* Calendar (left side) - Fixed width and height */}
        <div className="bg-[#FBFBFB] rounded-xl p-6 w-[25rem] h-[25rem]">
          <h2 className="text-lg font-secondary font-semibold mb-4">Event Dates</h2>
          
          {/* Add CustomNavigation component here */}
          <CustomNavigation 
            date={value} 
            onNavigate={setValue}
          />
          
          <div className="calendar-container">
            <Calendar
              value={value}
              onChange={onChangeHandler}
              tileClassName={tileClassName}
              showNavigation={false} // Hide default navigation
              formatShortWeekday={(locale, date) => {
                const dayIndex = date.getDay();
                const dayMap = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
                const day = dayMap[dayIndex];
                return day.charAt(0).toUpperCase() + day.charAt(1).toLowerCase();
              }}
            />
          </div>
        </div>

        {/* Graph (right side) - Takes remaining space */}
        <div className="bg-[#FBFBFB] rounded-xl p-6 flex-1 h-[25rem]">
          <h2 className="text-lg font-bold mb-0">Followers Institutes Distribution</h2>
          <FollowersPieChart data={instituteData} />
        </div>
      </div>

      {/* Donations Chart */}
      <div className="mb-8">
        <DonationsChart
          data={donationsData.length > 0 ? donationsData : undefined}
          loading={donationsLoading}
          onYearChange={handleYearChange}
        />
      </div>

      {/* Followers Chart */}
      <div className="mb-8">
        <FollowersChart 
          data={followersDataLineGraph}
          loading={followersLoading}
          onYearChange={handleFollowersYearChange}
        />
      </div>
    </div>
  );
}
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css'; 
import "@/app/styles/calendar.css"      
import SponsorshipsChart from "@/components/UI/SponsorshipsChart"; 
import CustomNavigation from "@/components/UI/CustomNavigation"; 
import authService from "@/services/authService";
import { useRouter } from "next/navigation";
import { User } from "@/services/authService";
import StatCard from "@/components/UI/StatCard";
import { BarChart } from "lucide-react";
import Image from "next/image";
import { sponsorService, SponsorEventData } from "@/services/sponsorService";


interface SponsorSettings {
  id: string;
  name: string;
  email: string;
  username: string;
  imageUrl: string;
  company: string;
  contactNumber?: string;
}

interface TileProps {
  date: Date;
  view: string;
}

interface DonationData {
  month: string;
  amount: number;
  label: string;
}

interface SponsorshipData {
  month: string;
  count: number;
  label: string;
}

export default function SponsorDashboardPage() {
  const [value, setValue] = useState(new Date());
  const [eventDates, setEventDates] = useState<Date[]>([]);
  const [donationsData, setDonationsData] = useState<DonationData[]>([]);
  const [donationsLoading, setDonationsLoading] = useState(false);
  const [sponsorshipsData, setSponsorshipsData] = useState<SponsorshipData[]>([]);
  const [sponsorshipsLoading, setSponsorshipsLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [sponsor, setSponsor] = useState<SponsorSettings | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();

  // New state for actual sponsor event data
  const [allSponsorEventData, setAllSponsorEventData] = useState<SponsorEventData[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);


  const [totalEventsSponsored, setTotalEventsSponsored] = useState<number>(0);
  const [totalSponsorships, setTotalSponsorships] = useState<number>(0);
  const [totalEventsDonated, setTotalEventsDonated] = useState<number>(12);
  const [totalDonations, setTotalDonations] = useState<string>("LKR 0");

  const username = "SPONSOR123"; 
  const sponsorId = 1; 

  useEffect(() => {
      const checkAuthAndLoadData = async () => {
        try {
          if (!authService.isAuthenticated()) {
            router.replace('/auth/login');
            return;
          }
  
          const currentUser = await authService.getCurrentUser();
          if (!currentUser) {
            router.replace('/auth/login');
            return;
          }
  
          // Check if profile is completed
          if (!currentUser.profileCompleted) {
            console.log(currentUser);
            router.replace('/auth/profile-form?type=sponsor');
            return;
          }
  
          setUser(currentUser);
        } catch (error) {
          console.error('Auth check error:', error);
          router.replace('/auth/signup');
        } finally {
          setIsLoading(false);
        }
      };
  
      checkAuthAndLoadData();
    }, [router]);


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

  // Function to fetch all sponsor event data and extract event dates
  const fetchSponsorEventData = async (sponsorId: number) => {
    setEventsLoading(true);
    try {
      const eventData = await sponsorService.getAllSponsorEventData(sponsorId);
      setAllSponsorEventData(eventData);

      // Extract event start dates for calendar highlighting
      // Only highlight ACTIVE and COMPLETED events (exclude PENDING, DENIED events)
      const dates: Date[] = eventData
        .filter(event => 
          event.requestStatus === 'APPROVED' &&
          (event.eventStatus === 'ACTIVE' || event.eventStatus === 'COMPLETE')
        )
        .map(event => {
          // Convert the eventStartDate string to a Date object
          const eventDate = new Date(event.eventStartDate);
          return eventDate;
        })
        .filter(date => !isNaN(date.getTime())); // Filter out invalid dates

      setEventDates(dates);
      console.log(`Sponsor has ${dates.length} event dates to highlight on calendar`);
      
      // Update stats with real data
      const activeEvents = sponsorService.getActiveEvents(eventData);
      const completedEvents = sponsorService.getCompletedEvents(eventData);
      const pendingRequests = sponsorService.getPendingRequests(eventData);

      // NEW: Count APPROVED sponsorship requests for "Total Events Sponsored"
      const approvedSponsorshipRequests = eventData.filter(event => event.requestStatus === 'APPROVED');
      setTotalEventsSponsored(approvedSponsorshipRequests.length);
    
      setTotalSponsorships(eventData.length);
      
     
      
      
      // Calculate total sponsorship amount
      const totalAmount = eventData
        .filter(event => event.requestStatus === 'APPROVED')
        .reduce((sum, event) => sum + event.sponsorshipAmount, 0);
      setTotalDonations(`LKR ${totalAmount.toLocaleString()}`);
      
    } catch (error) {
      console.error("Error fetching sponsor event data:", error);
      setEventDates([]);
    } finally {
      setEventsLoading(false);
    }
  };

  const fetchSponsorshipsData = async (sponsorId: number, year: number) => {
    setSponsorshipsLoading(true);
    try {
      
      setTimeout(() => {
        const yearData: Record<number, SponsorshipData[]> = {
          2023: [
            { month: 'JAN', count: 1, label: 'Jan' },
            { month: 'FEB', count: 0, label: 'Feb' },
            { month: 'MAR', count: 0, label: 'Mar' },
            { month: 'APR', count: 0, label: 'Apr' },
            { month: 'MAY', count: 0, label: 'May' },
            { month: 'JUN', count: 0, label: 'Jun' },
          ],
          2024: [
            { month: 'JAN', count: 1, label: 'Jan' },
            { month: 'FEB', count: 0, label: 'Feb' },
            { month: 'MAR', count: 0, label: 'Mar' },
            { month: 'APR', count: 1, label: 'Apr' },
            { month: 'MAY', count: 0, label: 'May' },
            { month: 'JUN', count: 1, label: 'Jun' },
          ],
          2025: [
            { month: 'SEP', count: 0, label: 'Sep' },
            { month: 'OCT', count: 0, label: 'Oct' },
            { month: 'NOV', count: 1, label: 'Nov' },
            { month: 'DEC', count: 0, label: 'Dec' },
            { month: 'JAN', count: 1, label: 'Jan' },
            { month: 'FEB', count: 1, label: 'Feb' },
          ],
        };
        
        setSponsorshipsData(yearData[year] || []);
        setSponsorshipsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching sponsorships data:", error);
      setSponsorshipsLoading(false);
    }
  };

  const fetchDonationsData = async (sponsorId: number, year: number) => {
    setDonationsLoading(true);
    try {
      // Mock data - will be replaced with actual API call
      setTimeout(() => {
        const yearData: Record<number, DonationData[]> = {
          2023: [
            { month: 'JAN', amount: 850, label: 'Jan' },
            { month: 'FEB', amount: 1200, label: 'Feb' },
            { month: 'MAR', amount: 980, label: 'Mar' },
            { month: 'APR', amount: 1500, label: 'Apr' },
            { month: 'MAY', amount: 1850, label: 'May' },
            { month: 'JUN', amount: 1620, label: 'Jun' },
          ],
          2024: [
            { month: 'JAN', amount: 1250, label: 'Jan' },
            { month: 'FEB', amount: 1820, label: 'Feb' },
            { month: 'MAR', amount: 1580, label: 'Mar' },
            { month: 'APR', amount: 2200, label: 'Apr' },
            { month: 'MAY', amount: 2520, label: 'May' },
            { month: 'JUN', amount: 2180, label: 'Jun' },
          ],
          2025: [
            { month: 'SEP', amount: 0, label: 'Sep' },
            { month: 'OCT', amount: 0, label: 'Oct' },
            { month: 'NOV', amount: 1, label: 'Nov' },
            { month: 'DEC', amount: 0, label: 'Dec' },
            { month: 'JAN', amount: 1, label: 'Jan' },
            { month: 'FEB', amount: 1, label: 'Feb' },
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

  useEffect(() => {
    async function fetchSponsorData() {
      try {
        
        const mockSponsorData: SponsorSettings = {
          id: "sponsor-123",
          name: "John Doe",
          email: "john.doe@techcorp.com",
          username: "SPONSOR123",
          imageUrl: "/images/default-profile.jpg",
          company: "TechCorp Solutions",
          contactNumber: "+1 (555) 123-4567"
        };
        setSponsor(mockSponsorData);
      } catch (error) {
        console.error("Failed to fetch sponsor", error);
      }
    }
    
    // Fetch real event data instead of mock data
    fetchSponsorEventData(sponsorId);
    fetchSponsorData();
    fetchDonationsData(sponsorId, selectedYear);
    fetchSponsorshipsData(sponsorId, selectedYear);
  }, [selectedYear, sponsorId]);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    fetchDonationsData(sponsorId, year);
  };

  const handleSponsorshipsYearChange = (year: number) => {
    setSelectedYear(year);
    fetchSponsorshipsData(sponsorId, year);
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
      {/* Title with Sponsor Info */}
      <div className="flex justify-between items-center mb-6">
        {/* Left Side: Title */}
        <div>
          <span className="text-shark-300">Sponsor / Dashboard</span>
          <h1 className="text-2xl font-primary font-bold mt-1">Main Dashboard</h1>
        </div>

        {/* Right Side: Sponsor Info */}
        {sponsor && (
          <div className="flex items-center gap-3">
            <Image
              src={sponsor.imageUrl} 
              alt="Sponsor Profile"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <div>
              <h2 className="font-semibold font-secondary text-xl leading-tight">{sponsor.name}</h2> 
              <p className="font-secondary font-semibold text-shark-600 text-xs leading-tight">{sponsor.company}</p>       
            </div>
          </div>
        )}
      </div>

      {/* Stat Cards Grid */}
      <div className="flex flex-wrap gap-10 mb-8">
        <StatCard title="Total Events Sponsored" value={totalEventsSponsored} icon={<BarChart size={20} />} />
        <StatCard title="Total Sponsorships" value={totalSponsorships} icon={<BarChart size={20} />} />
        <StatCard title="Total Events Donated" value={totalEventsDonated} icon={<BarChart size={20} />} />
        <StatCard title="Total Sponsorship Amount" value={totalDonations} icon={<BarChart size={20} />} />
      </div>

      {/* Calendar + Sponsorships Chart Section */}
      <div className="flex gap-6 mb-8">
        {/* Calendar (left side) - Fixed width */}
        <div className="bg-[#FBFBFB] rounded-xl p-6 w-[25rem] h-[25rem]">
          <h2 className="text-lg font-secondary font-semibold mb-4">Sponsored Event Dates</h2>
          
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

        {/* Sponsorships Chart (right side) - Takes remaining space */}
        <div className="bg-[#FBFBFB] rounded-xl p-6 flex-1 h-[25rem]">
          <SponsorshipsChart 
            data={sponsorshipsData}
            loading={sponsorshipsLoading}
            onYearChange={handleSponsorshipsYearChange}
          />
        </div>
      </div>
    </div>
  );
}
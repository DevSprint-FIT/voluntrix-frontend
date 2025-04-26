// components/UI/EventStatusCard.tsx
import React from "react";
import { BarChart } from "lucide-react";

interface EventStatusCardProps {
  count: number;
  label: string;
  subtext: string;
}

const EventStatusCard: React.FC<EventStatusCardProps> = ({ count, label, subtext }) => {
  return (
    <div className="bg-shark-50  rounded-xl p-4  min-w-[300px] flex-grow-0 flex-shrink-0 relative">
          
          
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-verdant-100 rounded-full p-2">
          <BarChart
             size={20}
             className="text-verdant-700 "
          />
          </div>
          

      <h3 className="font-secondary text-shark-950 font-medium">{label}</h3>
      <p className="text-2xl font-bold text-verdant-700">{count}</p>
      <p className="font-secondary text-shark-300 text-xs font-medium">{subtext}</p>
    </div>
  );
};

export default EventStatusCard;

import React from "react";
import { BarChart } from "lucide-react";

interface EventStatusCardProps {
  count?: number;
  label: string;
  subtext: string;
  loading?: boolean;
}

const EventStatusCard: React.FC<EventStatusCardProps> = ({
  count,
  label,
  subtext,
  loading,
}) => {
  return (
    <div
      style={{ backgroundColor: "#FBFBFB" }}
      className="rounded-xl p-6 min-w-[24rem] flex-grow-0 flex-shrink-0 relative"
    >
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-verdant-100 rounded-full p-2">
        <BarChart size={24} className="text-verdant-700" />
      </div>

      <h3 className="font-secondary text-shark-950 font-medium">{label}</h3>
      <div className="text-2xl font-bold text-verdant-600">
        {loading ? (
          <div className="w-6 h-6 border-4 border-verdant-600 border-t-transparent rounded-full animate-spin mx-auto" />
        ) : (
          <p>{count}</p>
        )}
      </div>

      <p className="font-secondary text-shark-300">{subtext}</p>
    </div>
  );
};

export default EventStatusCard;

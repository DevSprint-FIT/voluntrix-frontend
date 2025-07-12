

import { FC, ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
}

const StatCard: FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-[#FBFBFB] py-5 pl-3  rounded-xl  flex items-center gap-4  w-64">
      {icon && (
        <div className="bg-verdant-50 p-2 rounded-full text-verdant-600 font-bold">
          {icon}
        </div>
      )}
      <div >
        <div className="text-shark-200 text-sm font-semibold">{title}</div>
        <div className=" text-shark-900 font-primary text-xl font-bold">{value}</div>
      </div>
    </div>
  );
};

export default StatCard;

"use client"

import React from "react"

interface MetricCardProps {
    title: string;
    value: number;
    percentageChange: string;
    icon: React.ReactNode;
}

const MetricCard:React.FC<MetricCardProps> = ({ title, value, percentageChange, icon}) => {
    return(
        <div className="bg-[#F8F8F8] rounded-xl p-4 pr-2 shadow-sm flex justify-between items-center mb-3 ml-4 ">
            <div className="flex flex-col ">
               <div className="text-shark-900 font-medium">{title}</div>
               <div className="text-2xl font-bold text-verdant-600">{value}</div>
               <div className="text-sm text-shark-300">{percentageChange}</div>
            </div>
            
            <div className="text-verdant-200 mt-2 ">{icon}</div>
        </div>
    );
};

export default MetricCard;
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
        <div className="bg-[#F8F8F8] rounded-xl p-4 shadow-md flex justify-between items-center mb-3 ml-4">
            <div className="flex flex-col gap-1">
            <div className="text-shark-900 font-bold">{title}</div>
            <div className="text-2xl font-bold text-verdant-500">{value}</div>
            <div className="text-sm text-shark-400">{percentageChange}</div>
            </div>
            
            <div className="text-verdant-500 mt-2">{icon}</div>
        </div>
    );
};

export default MetricCard;
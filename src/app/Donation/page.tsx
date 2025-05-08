"use client"
import React from "react";
import DonationModal from "@/components/UI/DonationModal";

export default function Donation() {
    const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div>
     <button className="px-3 py-2 bg-green-400 text-white rounded-[4px]" onClick={()=>{
        setIsOpen(true);
     }}>Donate Me</button>

     {isOpen && 
     <DonationModal open={isOpen} setOpen={setIsOpen} />
     }

    </div>
  );
}
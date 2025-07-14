"use client"
import React from "react";
import SponsorshipsModal from "@/components/UI/SponsorshipsModalTest";


export default function Donation() {
    const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div>
     <button className="px-3 py-2 bg-green-400 text-white rounded-[4px]" onClick={()=>{
        setIsOpen(true);
     }}>I want to sponsor</button>

     {isOpen && 
     <SponsorshipsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
     }

    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
 

interface Button {
  label: string;
}

interface ButtonGroupProps {
  buttons: Button[];
  onSelect: (label: string) => void;
  activeButton: string; 
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({ buttons, onSelect, activeButton }) => {
  
  return (
    <div className="flex gap-6 justify-center text-lg">
      {buttons.map((btn) => (
        <Button
          key={btn.label}
          onClick={() => onSelect(btn.label)}
          className={`px-4 py-2 rounded-full text-base
            ${activeButton === btn.label ? "bg-shark-900 text-white" : "text-shark-500 bg-transparent"} 
            transition-colors duration-300`}
        >
          {btn.label}
        </Button>
      ))}
    </div>
  );
};

export default ButtonGroup;

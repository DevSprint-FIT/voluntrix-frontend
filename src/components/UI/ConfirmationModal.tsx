import React from "react";
import { X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmButtonText: string;
  confirmButtonClass?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmButtonText,
  confirmButtonClass = "bg-verdant-500 hover:bg-verdant-600 text-white",
  onConfirm,
  onCancel

}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 animate-fade-in">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-shark-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button 
            onClick={onCancel}
            className="px-4 py-2 border border-shark-200 rounded-full hover:bg-shark-50"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className={`px-4 py-2 rounded-full ${confirmButtonClass}`}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

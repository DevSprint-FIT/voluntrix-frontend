import React from "react";
import { Button } from "@heroui/button";
import { X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-shark-950 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 relative">
        {/* Close Icon */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-shark-400 hover:text-shark-600 text-xl"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <svg
            className="w-5 h-5 text-red-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M3 6h18M9 6V4h6v2m-6 0v2m6-2v2m-8 4h8m-8 4h8m-8 4h8M5 6v14a2 2 0 002 2h10a2 2 0 002-2V6" />
          </svg>
          <h2 className="text-lg font-secondary font-semibold">{title}</h2>
        </div>

        {/* Body Text */}
        <p className="text-sm text-shark-700 mb-6">{message}</p>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            onPress={onCancel}
            className="px-4 py-2 rounded-full border border-shark-300 bg-white text-shark-950 hover:bg-shark-50"
          >
            Cancel
          </Button>
          <Button
            onPress={onConfirm}
            className="px-4 py-2 rounded-full bg-shark-950 text-white hover:bg-shark-400"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

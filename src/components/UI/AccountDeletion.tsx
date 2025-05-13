"use client";

import { X, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@heroui/button";

interface AccountDeletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AccountDeletionModal = ({
  isOpen,
  onClose,
  onConfirm,
}: AccountDeletionModalProps) => {

  const [confirmChecked, setConfirmChecked] = useState(false);
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-shark-950 bg-opacity-60">
      <div className="relative bg-white text-shark-950 p-6 rounded-xl w-full max-w-lg shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-shark-500 hover:text-shark-700"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="text-red-600 w-6 h-6" />
          <h2 className="text-xl font-semibold font-secondary">
            Permanently delete your Voluntrix account
          </h2>
        </div>

        {/* Description */}
        <p className="text-red-600 font-secondary font-medium mb-2">
          This action cannot be undone!
        </p>

        <ul className="list-disc list-inside text-sm mb-4">
          <li>Your data, posts, and participation history will be erased.</li>
          <li>You won’t be able to host or join any events again.</li>
        </ul>

        <p className="text-sm mb-4">
          You can update your profile or preferences without deleting your account.
        </p>

        {/* Checkbox */}
        <div className="flex items-start mb-6 bg-[#FBFBFB] p-3 rounded">
          <input
            type="checkbox"
            id="confirmDelete"
            className="mt-1 mr-2"
            checked={confirmChecked}
            onChange={(e) => setConfirmChecked(e.target.checked)}
          />
          <label htmlFor="confirmDelete" className="text-sm">
            I understand this action is permanent.
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <Button
            onPress={onClose}
            className="px-4 py-2 rounded-full border border-shark-300 text-shark-950 hover:bg-shark-50"
          >
            Cancel
          </Button>
          <Button
            id="delete-btn"
            disabled={!confirmChecked}
            onPress={onConfirm}
            className="px-4 py-2 rounded-full text-white bg-red-600 hover:bg-red-400 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountDeletionModal;

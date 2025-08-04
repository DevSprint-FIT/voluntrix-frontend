import React from 'react';
import { Check } from 'lucide-react';

interface TaskApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskDescription: string;
  isLoading?: boolean;
}

const TaskApprovalModal: React.FC<TaskApprovalModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  taskDescription,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center mb-4">
          <div className="bg-green-100 rounded-full p-2 mr-3">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-shark-950 font-secondary">
            Approve Task
          </h2>
        </div>

        <p className="text-shark-600 mb-2 font-secondary">
          Are you sure you want to approve this task?
        </p>
        
        <div className="bg-gray-50 rounded-lg p-3 mb-6">
          <p className="text-sm text-shark-700 font-secondary">
            <strong>Task:</strong> {taskDescription}
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-shark-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-secondary disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-secondary disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <Check size={16} />
                Approve Task
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskApprovalModal;

import React from 'react';
import { CheckCircle, X, AlertCircle } from 'lucide-react';

interface TaskActionResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  message: string;
}

const TaskActionResultModal: React.FC<TaskActionResultModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
}) => {
  if (!isOpen) return null;

  const isSuccess = type === 'success';
  const Icon = isSuccess ? CheckCircle : AlertCircle;
  const iconBgColor = isSuccess ? 'bg-green-100' : 'bg-red-100';
  const iconColor = isSuccess ? 'text-green-600' : 'text-red-600';
  const buttonColor = isSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center mb-4">
          <div className={`${iconBgColor} rounded-full p-2 mr-3`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <h2 className="text-xl font-semibold text-shark-950 font-secondary">
            {title}
          </h2>
        </div>

        <p className="text-shark-600 mb-6 font-secondary">
          {message}
        </p>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-white rounded-lg transition-colors font-secondary ${buttonColor}`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskActionResultModal;

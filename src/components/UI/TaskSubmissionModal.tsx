import React, { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';

interface TaskSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  taskDescription: string;
  onSubmit: (taskId: string, resourceUrl: string) => Promise<boolean>;
}

const TaskSubmissionModal: React.FC<TaskSubmissionModalProps> = ({
  isOpen,
  onClose,
  taskId,
  taskDescription,
  onSubmit,
}) => {
  const [resourceUrl, setResourceUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resourceUrl.trim()) {
      setErrorMessage('Please enter a valid resource URL');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const success = await onSubmit(taskId, resourceUrl.trim());
      
      if (success) {
        setSubmitStatus('success');
        // Auto-close modal after 2 seconds on success
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setSubmitStatus('error');
        setErrorMessage('Failed to submit task. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('An error occurred while submitting the task.');
      console.error('Task submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setResourceUrl('');
    setSubmitStatus('idle');
    setErrorMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-shark-950 font-secondary">
            Submit Task
          </h2>
          <button
            onClick={handleClose}
            className="text-shark-400 hover:text-shark-600"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-shark-600 font-secondary text-sm mb-2">Task Description:</p>
          <p className="text-shark-950 font-secondary font-medium bg-gray-50 p-3 rounded-lg">
            {taskDescription}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-shark-700 font-secondary font-medium mb-2">
              Resource URL <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="url"
                value={resourceUrl}
                onChange={(e) => setResourceUrl(e.target.value)}
                placeholder="https://example.com/your-submission"
                className="w-full px-4 py-2 border border-shark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-verdant-500 focus:border-transparent font-secondary"
                disabled={isSubmitting}
                required
              />
              <ExternalLink size={16} className="absolute right-3 top-3 text-shark-400" />
            </div>
            <p className="text-xs text-shark-500 mt-1 font-secondary">
              Enter the URL where your completed task can be reviewed
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-secondary text-sm">{errorMessage}</p>
            </div>
          )}

          {submitStatus === 'success' && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-secondary text-sm">
                Task submitted successfully! The task is now in review.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-shark-300 text-shark-700 rounded-full font-primary hover:bg-shark-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-verdant-600 text-white rounded-full font-primary hover:bg-verdant-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || !resourceUrl.trim()}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskSubmissionModal;

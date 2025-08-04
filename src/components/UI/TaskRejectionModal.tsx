import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { DatePicker } from "@heroui/date-picker";
import { parseDate } from "@internationalized/date";

interface TaskRejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (updatedDescription: string, updatedDueDate: string) => void;
  taskDescription: string;
  currentDueDate: string;
  isLoading?: boolean;
}

const TaskRejectionModal: React.FC<TaskRejectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  taskDescription,
  currentDueDate,
  isLoading = false,
}) => {
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedDueDate, setUpdatedDueDate] = useState("");
  const [errors, setErrors] = useState<{
    description?: string;
    dueDate?: string;
  }>({});

  useEffect(() => {
    if (isOpen) {
      setUpdatedDescription(taskDescription);
      setUpdatedDueDate(currentDueDate);
      setErrors({});
    }
  }, [isOpen, taskDescription, currentDueDate]);

  const validateForm = () => {
    const newErrors: { description?: string; dueDate?: string } = {};

    if (!updatedDescription.trim()) {
      newErrors.description = "Description is required";
    } else if (updatedDescription.length > 500) {
      newErrors.description = "Description must be 500 characters or less";
    }

    if (!updatedDueDate) {
      newErrors.dueDate = "Due date is required";
    } else {
      // Validate that due date is not in the past
      const selectedDate = new Date(updatedDueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate <= today) {
        newErrors.dueDate = "Due date must be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDateChange = (date: any) => {
    if (date) {
      // Create a date string in YYYY-MM-DD format directly to avoid timezone issues
      const year = date.year;
      const month = date.month.toString().padStart(2, "0");
      const day = date.day.toString().padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;
      setUpdatedDueDate(dateString);
    } else {
      setUpdatedDueDate("");
    }
  };

  const formatDateForDatePicker = (dateString: string) => {
    if (!dateString) return null;
    // dateString is already in YYYY-MM-DD format
    return parseDate(dateString);
  };

  // Get tomorrow's date as the minimum selectable date
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = (tomorrow.getMonth() + 1).toString().padStart(2, "0");
    const day = tomorrow.getDate().toString().padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;
    return parseDate(dateString);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onConfirm(updatedDescription, updatedDueDate);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center mb-4">
          <div className="bg-orange-100 rounded-full p-2 mr-3">
            <AlertCircle className="h-6 w-6 text-orange-600" />
          </div>
          <h2 className="text-xl font-semibold text-shark-950 font-secondary">
            Request Task Revision
          </h2>
        </div>

        <p className="text-shark-600 mb-4 font-secondary">
          Provide feedback and updated requirements for this task.
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-shark-700 mb-2 font-secondary">
              Updated Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
              className={`w-full p-3 border rounded-lg font-secondary resize-none ${
                errors.description ? "border-red-300" : "border-gray-300"
              }`}
              rows={4}
              maxLength={500}
              placeholder="Add feedback and requirements for revision..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1 font-secondary">
                {errors.description}
              </p>
            )}
            <p className="text-gray-500 text-xs mt-1 font-secondary">
              {updatedDescription.length}/500 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-shark-700 mb-2 font-secondary">
              Updated Due Date <span className="text-red-500">*</span>
            </label>
            <DatePicker
              value={formatDateForDatePicker(updatedDueDate)}
              onChange={handleDateChange}
              minValue={getTomorrowDate()}
              className="w-full"
              classNames={{
                base: "w-full",
                inputWrapper: `border-2 rounded-xl h-12 ${
                  errors.dueDate
                    ? "border-red-300"
                    : "border-gray-300 hover:border-gray-400 group-data-[focus=true]:border-verdant-500"
                }`,
                input: "text-shark-700 font-secondary px-4",
                selectorButton: "text-shark-500 hover:text-verdant-600",
                popoverContent:
                  "bg-white border border-gray-200 rounded-xl shadow-lg p-4",
                calendar: "bg-white",
                calendarContent: "text-shark-950",
              }}
              color="success"
              variant="bordered"
              granularity="day"
              placeholderValue={getTomorrowDate()}
              isRequired
              showMonthAndYearPickers
            />
            {errors.dueDate && (
              <p className="text-red-500 text-sm mt-1 font-secondary">
                {errors.dueDate}
              </p>
            )}
          </div>
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
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-secondary disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <AlertCircle size={16} />
                Request Revision
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskRejectionModal;

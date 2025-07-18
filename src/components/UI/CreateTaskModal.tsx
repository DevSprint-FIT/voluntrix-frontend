"use client";

import React, { useState } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@heroui/button";
import { DatePicker } from "@heroui/date-picker";
import { parseDate } from "@internationalized/date";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskFormData) => Promise<boolean>;
}

export interface TaskFormData {
  description: string;
  difficulty: string;
  category: string;
  assignee: string;
  dueDate: string;
}

// Notification Modal Component
const NotificationModal = ({
  isOpen,
  onClose,
  type,
  title,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error";
  title: string;
  message: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {type === "success" ? (
              <CheckCircle className="text-green-600" size={24} />
            ) : (
              <AlertCircle className="text-red-600" size={24} />
            )}
            <h2 className="text-lg font-semibold font-secondary text-gray-900">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-gray-600 font-secondary mb-6">{message}</p>
        <div className="flex justify-end">
          <Button
            onPress={onClose}
            className={`rounded-full font-primary tracking-wide text-base ${
              type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
};

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    description: "",
    difficulty: "",
    category: "",
    assignee: "",
    dueDate: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<"success" | "error">(
    "success"
  );
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  // Dropdown options
  const difficultyOptions = ["EASY", "MEDIUM", "HARD", "EXTREME"];
  const categoryOptions = ["DESIGN", "EDITORIAL", "LOGISTICS", "PROGRAMMING"];
  const assigneeOptions = ["John Doe", "Jane Smith", "Mike Johnson"]; // Dummy names

  const handleInputChange = (field: keyof TaskFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (date: any) => {
    if (date) {
      // Convert HeroUI date to ISO string
      // Note: HeroUI date object has 1-based months, JavaScript Date has 0-based months
      const jsDate = new Date(date.year, date.month - 1, date.day, 0, 0, 0, 0);
      const isoString = jsDate.toISOString();
      handleInputChange("dueDate", isoString);
    } else {
      handleInputChange("dueDate", "");
    }
  };

  const formatDateForDatePicker = (isoString: string) => {
    if (!isoString) return null;
    const date = new Date(isoString);
    // Ensure we're getting the correct date components in local time
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.description.trim()) {
      setNotificationType("error");
      setNotificationTitle("Validation Error");
      setNotificationMessage("Task description is required.");
      setShowNotification(true);
      return;
    }

    if (formData.description.length > 500) {
      setNotificationType("error");
      setNotificationTitle("Validation Error");
      setNotificationMessage("Task description cannot exceed 500 characters.");
      setShowNotification(true);
      return;
    }

    if (
      !formData.difficulty ||
      !formData.category ||
      !formData.assignee ||
      !formData.dueDate
    ) {
      setNotificationType("error");
      setNotificationTitle("Validation Error");
      setNotificationMessage("All fields are required.");
      setShowNotification(true);
      return;
    }

    // Validate that due date is not in the past
    const selectedDate = new Date(formData.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to beginning of day
    selectedDate.setHours(0, 0, 0, 0); // Reset time to beginning of day

    if (selectedDate <= today) {
      setNotificationType("error");
      setNotificationTitle("Invalid Due Date");
      setNotificationMessage("Due date must be at least one day from today.");
      setShowNotification(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onSubmit(formData);
      if (success) {
        setNotificationType("success");
        setNotificationTitle("Task Created");
        setNotificationMessage(
          "Task has been successfully created and assigned."
        );
        setShowNotification(true);

        // Reset form
        setFormData({
          description: "",
          difficulty: "",
          category: "",
          assignee: "",
          dueDate: "",
        });
      } else {
        setNotificationType("error");
        setNotificationTitle("Creation Failed");
        setNotificationMessage("Failed to create task. Please try again.");
        setShowNotification(true);
      }
    } catch (error) {
      setNotificationType("error");
      setNotificationTitle("Creation Failed");
      setNotificationMessage("An unexpected error occurred. Please try again.");
      setShowNotification(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
    if (notificationType === "success") {
      onClose(); // Close the main modal on success
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-secondary text-shark-950">
              Create New Task
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isSubmitting}
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Task Description */}
            <div>
              <label className="block text-sm font-medium text-shark-700 font-secondary mb-2">
                Task Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Description can be up to 500 characters"
                className="w-full px-4 py-3 border-2 border-shark-200 rounded-xl focus:ring-0 focus:outline-none focus:border-verdant-500 resize-none font-secondary"
                rows={4}
                maxLength={500}
                required
              />
              <div className="text-right text-xs text-shark-400 mt-1">
                {formData.description.length}/500 characters
              </div>
            </div>

            {/* Task Difficulty */}
            <div>
              <label className="block text-sm font-medium text-shark-700 font-secondary mb-2">
                Task Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) =>
                  handleInputChange("difficulty", e.target.value)
                }
                className="w-full px-4 py-3 border-2 border-shark-200 rounded-xl focus:ring-0 focus:outline-none focus:border-verdant-500 font-secondary"
                required
              >
                <option value="">Select difficulty level</option>
                {difficultyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Task Category */}
            <div>
              <label className="block text-sm font-medium text-shark-700 font-secondary mb-2">
                Task Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-4 py-3 border-2 border-shark-200 rounded-xl focus:ring-0 focus:outline-none focus:border-verdant-500 font-secondary"
                required
              >
                <option value="">Select task category</option>
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-sm font-medium text-shark-700 font-secondary mb-2">
                Assignee
              </label>
              <select
                value={formData.assignee}
                onChange={(e) => handleInputChange("assignee", e.target.value)}
                className="w-full px-4 py-3 border-2 border-shark-200 rounded-xl focus:ring-0 focus:outline-none focus:border-verdant-500 font-secondary"
                required
              >
                <option value="">Select assignee</option>
                {assigneeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-shark-700 font-secondary mb-2">
                Due Date
              </label>
              <DatePicker
                value={formatDateForDatePicker(formData.dueDate)}
                onChange={handleDateChange}
                minValue={getTomorrowDate()}
                className="w-full"
                classNames={{
                  base: "w-full",
                  inputWrapper:
                    "border-2 border-shark-200 hover:border-shark-300 group-data-[focus=true]:border-verdant-500 h-12 rounded-xl",
                  input: "text-shark-700 font-secondary",
                  selectorButton: "text-shark-500 hover:text-verdant-600",
                }}
                color="success"
                variant="bordered"
                isRequired
                showMonthAndYearPickers
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                onPress={onClose}
                className="flex-1 rounded-full font-primary tracking-wide text-base bg-shark-200 text-shark-700 hover:bg-shark-300"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-full font-primary tracking-wide text-base bg-verdant-600 text-white hover:bg-verdant-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Task"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={showNotification}
        onClose={handleNotificationClose}
        type={notificationType}
        title={notificationTitle}
        message={notificationMessage}
      />
    </>
  );
};

export default CreateTaskModal;

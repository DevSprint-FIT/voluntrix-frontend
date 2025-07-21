"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@heroui/button";
import { DatePicker } from "@heroui/date-picker";
import { parseDate } from "@internationalized/date";
import Toast from "@/components/UI/Toast";
import {
  hostWorkspaceTaskService,
  TaskCreateDTO,
  VolunteerEventParticipationDTO,
} from "@/services/hostWorkspaceTaskService";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskFormData) => Promise<boolean>;
  eventId: number;
}

export interface TaskFormData {
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "EXTREME";
  category: "DESIGN" | "EDITORIAL" | "LOGISTICS" | "PROGRAMMING";
  assigneeId: number;
  dueDate: string;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  eventId,
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    description: "",
    difficulty: "EASY",
    category: "DESIGN",
    assigneeId: 0,
    dueDate: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "idle" | "submitting" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  // Remove toast states - we'll use button status instead
  // const [toastVisible, setToastVisible] = useState(false);
  // const [toastType, setToastType] = useState<"success" | "error">("success");
  // const [toastMessage, setToastMessage] = useState("");

  // Helper function to show toast
  const showToast = (type: "success" | "error", message: string) => {
    setSubmitStatus({ type, message });

    // Auto-reset status after showing success/error
    if (type === "success") {
      setTimeout(() => {
        setSubmitStatus({ type: "idle", message: "" });
        onClose();
      }, 2000);
    } else {
      setTimeout(() => {
        setSubmitStatus({ type: "idle", message: "" });
      }, 3000);
    }
  };

  // Available volunteers state
  const [availableVolunteers, setAvailableVolunteers] = useState<
    VolunteerEventParticipationDTO[]
  >([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState<
    VolunteerEventParticipationDTO[]
  >([]);
  const [isLoadingVolunteers, setIsLoadingVolunteers] = useState(false);

  // Dropdown options
  const difficultyOptions: Array<"EASY" | "MEDIUM" | "HARD" | "EXTREME"> = [
    "EASY",
    "MEDIUM",
    "HARD",
    "EXTREME",
  ];
  const categoryOptions: Array<
    "DESIGN" | "EDITORIAL" | "LOGISTICS" | "PROGRAMMING"
  > = ["DESIGN", "EDITORIAL", "LOGISTICS", "PROGRAMMING"];

  // Load available volunteers when modal opens
  useEffect(() => {
    if (isOpen) {
      loadAvailableVolunteers();
    }
  }, [isOpen, eventId]);

  // Filter volunteers when category changes
  useEffect(() => {
    if (formData.category) {
      const filtered =
        hostWorkspaceTaskService.filterVolunteersByContributionArea(
          availableVolunteers,
          formData.category
        );
      setFilteredVolunteers(filtered);

      // Reset assignee if current selection is not in filtered list
      if (
        formData.assigneeId &&
        !filtered.find((v) => v.volunteerId === formData.assigneeId)
      ) {
        setFormData((prev) => ({ ...prev, assigneeId: 0 }));
      }
    } else {
      setFilteredVolunteers([]);
      setFormData((prev) => ({ ...prev, assigneeId: 0 }));
    }
  }, [formData.category, availableVolunteers]);

  const loadAvailableVolunteers = async () => {
    setIsLoadingVolunteers(true);
    try {
      const volunteers = await hostWorkspaceTaskService.getAvailableVolunteers(
        eventId
      );
      setAvailableVolunteers(volunteers);
    } catch (error) {
      console.error("Error loading available volunteers:", error);
      showToast(
        "error",
        "Failed to load available volunteers. Please try again."
      );
    } finally {
      setIsLoadingVolunteers(false);
    }
  };

  const handleInputChange = (
    field: keyof TaskFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (date: any) => {
    if (date) {
      // Create a date string in YYYY-MM-DD format directly to avoid timezone issues
      const year = date.year;
      const month = date.month.toString().padStart(2, "0");
      const day = date.day.toString().padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;
      handleInputChange("dueDate", dateString);
    } else {
      handleInputChange("dueDate", "");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.description.trim()) {
      setSubmitStatus({
        type: "error",
        message: "Task description is required",
      });
      setTimeout(() => setSubmitStatus({ type: "idle", message: "" }), 3000);
      return;
    }

    if (formData.description.length > 500) {
      setSubmitStatus({
        type: "error",
        message: "Description too long (max 500 characters)",
      });
      setTimeout(() => setSubmitStatus({ type: "idle", message: "" }), 3000);
      return;
    }

    if (
      !formData.difficulty ||
      !formData.category ||
      !formData.assigneeId ||
      !formData.dueDate
    ) {
      setSubmitStatus({ type: "error", message: "All fields are required" });
      setTimeout(() => setSubmitStatus({ type: "idle", message: "" }), 3000);
      return;
    }

    // Validate that due date is not in the past
    const selectedDate = new Date(formData.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to beginning of day
    selectedDate.setHours(0, 0, 0, 0); // Reset time to beginning of day

    if (selectedDate <= today) {
      setSubmitStatus({
        type: "error",
        message: "Due date must be at least one day from today",
      });
      setTimeout(() => setSubmitStatus({ type: "idle", message: "" }), 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: "submitting", message: "Creating task..." });

    try {
      const success = await onSubmit(formData);
      if (success) {
        setSubmitStatus({
          type: "success",
          message: "Task created successfully!",
        });

        // Reset form
        setFormData({
          description: "",
          difficulty: "EASY",
          category: "DESIGN",
          assigneeId: 0,
          dueDate: "",
        });

        // Close modal after showing success message
        setTimeout(() => {
          setSubmitStatus({ type: "idle", message: "" });
          onClose();
        }, 2000);
      } else {
        setSubmitStatus({ type: "error", message: "Failed to create task" });
        setTimeout(() => {
          setSubmitStatus({ type: "idle", message: "" });
        }, 3000);
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "An unexpected error occurred",
      });
      setTimeout(() => {
        setSubmitStatus({ type: "idle", message: "" });
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto relative">
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
                value={formData.assigneeId}
                onChange={(e) =>
                  handleInputChange("assigneeId", parseInt(e.target.value))
                }
                className="w-full px-4 py-3 border-2 border-shark-200 rounded-xl focus:ring-0 focus:outline-none focus:border-verdant-500 font-secondary"
                required
                disabled={isLoadingVolunteers || !formData.category}
              >
                <option value={0}>
                  {isLoadingVolunteers
                    ? "Loading volunteers..."
                    : !formData.category
                    ? "Please select a category first"
                    : "Select assignee"}
                </option>
                {filteredVolunteers.map((volunteer) => (
                  <option
                    key={volunteer.volunteerId}
                    value={volunteer.volunteerId}
                  >
                    {volunteer.volunteerUsername}
                  </option>
                ))}
              </select>
              {formData.category &&
                filteredVolunteers.length === 0 &&
                !isLoadingVolunteers && (
                  <p className="text-sm text-orange-600 mt-1 font-secondary">
                    No volunteers available for {formData.category} category.
                  </p>
                )}
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
                className={`flex-1 rounded-full font-primary tracking-wide text-base ${
                  submitStatus.type === "success"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : submitStatus.type === "error"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-verdant-600 text-white hover:bg-verdant-700"
                }`}
                disabled={isSubmitting || submitStatus.type === "success"}
              >
                <div className="flex items-center gap-2">
                  {submitStatus.type === "submitting" && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {submitStatus.type === "success" && (
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {submitStatus.type === "error" && (
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <span>
                    {submitStatus.type !== "idle" && submitStatus.message
                      ? submitStatus.message
                      : "Create Task"}
                  </span>
                </div>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateTaskModal;

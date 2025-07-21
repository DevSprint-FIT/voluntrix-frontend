import React, { useState } from "react";
import {
  X,
  ExternalLink,
  Upload,
  File,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { uploadToCloudinary } from "@/services/ImageUploadService";

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
  const [resourceUrl, setResourceUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadMethod, setUploadMethod] = useState<"url" | "file">("url");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        setErrorMessage("File size must be less than 10MB");
        return;
      }
      
      setSelectedFile(file);
      setResourceUrl(""); // Clear URL input when file is selected
      setErrorMessage(""); // Clear any previous errors
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setErrorMessage("");

    try {
      const secureUrl = await uploadToCloudinary(selectedFile);
      setUploadedFileUrl(secureUrl);
      setResourceUrl(secureUrl);
      setSubmitStatus("idle");
    } catch (error) {
      console.error("File upload failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upload file. Please try again.";
      setErrorMessage(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If file upload method is selected but no file is uploaded yet
    if (uploadMethod === "file" && selectedFile && !uploadedFileUrl) {
      await handleFileUpload();
      return; // Wait for upload to complete before submitting
    }

    if (!resourceUrl.trim()) {
      setErrorMessage("Please provide a valid resource URL or upload a file");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const success = await onSubmit(taskId, resourceUrl.trim());

      if (success) {
        setSubmitStatus("success");
        // Auto-close modal after 2 seconds on success
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setSubmitStatus("error");
        setErrorMessage("Failed to submit task. Please try again.");
      }
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage("An error occurred while submitting the task.");
      console.error("Task submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setResourceUrl("");
    setSelectedFile(null);
    setUploadedFileUrl("");
    setUploadMethod("url");
    setSubmitStatus("idle");
    setErrorMessage("");
    setIsUploading(false);
    onClose();
  };

  const canSubmit = () => {
    if (uploadMethod === "url") {
      return resourceUrl.trim() !== "";
    } else {
      return uploadedFileUrl !== "" || (selectedFile && !isUploading);
    }
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
          <p className="text-shark-600 font-secondary text-sm mb-2">
            Task Description:
          </p>
          <p className="text-shark-950 font-secondary font-medium bg-gray-50 p-3 rounded-lg">
            {taskDescription}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Upload Method Selection */}
          <div className="mb-4">
            <label className="block text-shark-700 font-secondary font-medium mb-2">
              Submission Method
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="url"
                  checked={uploadMethod === "url"}
                  onChange={(e) =>
                    setUploadMethod(e.target.value as "url" | "file")
                  }
                  className="mr-2"
                  disabled={isSubmitting || isUploading}
                />
                <span className="font-secondary text-sm">Enter URL</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="file"
                  checked={uploadMethod === "file"}
                  onChange={(e) =>
                    setUploadMethod(e.target.value as "url" | "file")
                  }
                  className="mr-2"
                  disabled={isSubmitting || isUploading}
                />
                <span className="font-secondary text-sm">Upload File</span>
              </label>
            </div>
          </div>

          {/* URL Input */}
          {uploadMethod === "url" && (
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
                  disabled={isSubmitting || isUploading}
                  required
                />
                <ExternalLink
                  size={16}
                  className="absolute right-3 top-3 text-shark-400"
                />
              </div>
              <p className="text-xs text-shark-500 mt-1 font-secondary">
                Enter the URL where your completed task can be reviewed
              </p>
            </div>
          )}

          {/* File Upload */}
          {uploadMethod === "file" && (
            <div className="mb-4">
              <label className="block text-shark-700 font-secondary font-medium mb-2">
                Upload File <span className="text-red-500">*</span>
              </label>

              {!selectedFile && !uploadedFileUrl && (
                <div className="border-2 border-dashed border-shark-200 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-shark-400" />
                  <div className="mt-2">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-verdant-600 hover:text-verdant-700 font-secondary font-medium">
                        Choose a file
                      </span>
                      <input
                        id="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileSelect}
                        disabled={isSubmitting || isUploading}
                        accept="image/*,video/*,.pdf,.doc,.docx,.txt,.zip,.rar"
                      />
                    </label>
                    <p className="text-shark-500 text-sm font-secondary">
                      or drag and drop
                    </p>
                  </div>
                  <p className="text-xs text-shark-500 mt-1 font-secondary">
                    Images, Videos, Documents, Archives up to 10MB
                  </p>
                </div>
              )}

              {selectedFile && !uploadedFileUrl && (
                <div className="border border-shark-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <File className="h-8 w-8 text-shark-400 mr-2" />
                      <div>
                        <p className="font-secondary font-medium text-shark-700">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-shark-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setResourceUrl("");
                      }}
                      className="text-shark-400 hover:text-shark-600"
                      disabled={isSubmitting || isUploading}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {!isUploading && (
                    <button
                      type="button"
                      onClick={handleFileUpload}
                      className="mt-3 w-full px-4 py-2 bg-verdant-600 text-white rounded-lg font-secondary hover:bg-verdant-700 transition-colors"
                      disabled={isSubmitting}
                    >
                      Upload File
                    </button>
                  )}

                  {isUploading && (
                    <div className="mt-3 text-center">
                      <div className="text-verdant-600 font-secondary text-sm">
                        Uploading...
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-verdant-600 h-2 rounded-full animate-pulse"
                          style={{ width: "60%" }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {uploadedFileUrl && (
                <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-secondary text-green-800">
                      File uploaded successfully!
                    </span>
                  </div>
                  <p className="text-xs text-green-700 mt-1 font-secondary break-all">
                    {uploadedFileUrl}
                  </p>
                </div>
              )}
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
              <p className="text-red-800 font-secondary text-sm">
                {errorMessage}
              </p>
            </div>
          )}

          {submitStatus === "success" && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
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
              disabled={isSubmitting || isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-verdant-600 text-white rounded-full font-primary hover:bg-verdant-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || isUploading || !canSubmit()}
            >
              {isSubmitting
                ? "Submitting..."
                : uploadMethod === "file" && selectedFile && !uploadedFileUrl
                ? "Upload & Submit"
                : "Submit Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskSubmissionModal;

"use client";

import React, { useState } from "react";
import {
  ClipboardList,
  Clock,
  Eye,
  CheckCircle,
  Plus,
  Check,
  X,
} from "lucide-react";
import Table, { Column } from "@/components/UI/Table";
import CreateTaskModal, { TaskFormData } from "@/components/UI/CreateTaskModal";

// Types for different task states
interface TaskPendingReview {
  taskId: string;
  description: string;
  assignee: string;
  submittedDate: string;
  category: string;
  difficulty: string;
}

interface TaskToBeCompleted {
  taskId: string;
  description: string;
  assignee: string;
  dueDate: string;
  category: string;
  difficulty: string;
}

interface CompletedTask {
  taskId: string;
  description: string;
  assignee: string;
  submittedDate: string;
  reviewedDate: string;
  category: string;
  difficulty: string;
  rewardPoints: number;
}

const EventHostTasksPage = () => {
  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Dummy task stats
  const taskStats = {
    totalTasksPendingReview: 3,
    totalTasksToBeCompleted: 5,
    totalTasksCompleted: 8,
  };

  // Dummy data for tasks pending review
  const tasksPendingReview: TaskPendingReview[] = [
    {
      taskId: "1",
      description: "Create promotional banners for social media",
      assignee: "John Doe",
      submittedDate: "2025-07-23",
      category: "DESIGN",
      difficulty: "MEDIUM",
    },
    {
      taskId: "2",
      description: "Setup registration booth equipment",
      assignee: "Jane Smith",
      submittedDate: "2025-07-22",
      category: "LOGISTICS",
      difficulty: "EASY",
    },
  ];

  // Dummy data for tasks to be completed
  const tasksToBeCompleted: TaskToBeCompleted[] = [
    {
      taskId: "3",
      description: "Coordinate with catering vendors",
      assignee: "Mike Johnson",
      dueDate: "2025-07-28",
      category: "LOGISTICS",
      difficulty: "HARD",
    },
    {
      taskId: "4",
      description: "Prepare volunteer welcome packets",
      assignee: "Sarah Wilson",
      dueDate: "2025-07-26",
      category: "EDITORIAL",
      difficulty: "EASY",
    },
  ];

  // Dummy data for completed tasks
  const completedTasks: CompletedTask[] = [
    {
      taskId: "5",
      description: "Design event program booklet",
      assignee: "Alex Brown",
      submittedDate: "2025-07-20",
      reviewedDate: "2025-07-21",
      category: "DESIGN",
      difficulty: "MEDIUM",
      rewardPoints: 150,
    },
    {
      taskId: "6",
      description: "Book venue and confirm logistics",
      assignee: "Emily Davis",
      submittedDate: "2025-07-18",
      reviewedDate: "2025-07-19",
      category: "PROGRAMMING",
      difficulty: "HARD",
      rewardPoints: 200,
    },
  ];

  const TaskStatusCard = ({
    count,
    label,
    subtext,
    icon: Icon,
  }: {
    count: number;
    label: string;
    subtext: string;
    icon: React.ElementType;
  }) => {
    return (
      <div
        style={{ backgroundColor: "#FBFBFB" }}
        className="rounded-xl p-6 min-w-[23rem] min-h-[8rem] flex-grow-0 flex-shrink-0 flex items-center gap-10"
      >
        <div className="bg-verdant-50 rounded-full p-3 flex-shrink-0">
          <Icon size={32} className="text-verdant-700" />
        </div>

        <div className="flex-1">
          <h3 className="font-secondary text-shark-950 font-medium text-lg">
            {label}
          </h3>
          <div className="text-3xl font-bold text-verdant-600 min-h-[2.5rem]">
            {count}
          </div>
          <p className="font-secondary text-sm text-shark-300">{subtext}</p>
        </div>
      </div>
    );
  };

  // Helper function to get difficulty badge color
  const getDifficultyBadgeColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-100 text-green-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "HARD":
        return "bg-orange-100 text-orange-800";
      case "EXTREME":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to get category badge color using system colors
  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "DESIGN":
        return "bg-verdant-100 text-verdant-800";
      case "EDITORIAL":
        return "bg-verdant-200 text-verdant-900";
      case "LOGISTICS":
        return "bg-shark-100 text-shark-800";
      case "PROGRAMMING":
        return "bg-shark-200 text-shark-900";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Placeholder functions for approve/reject actions
  const handleApproveTask = (taskId: string) => {
    console.log(`Approving task: ${taskId}`);
    // TODO: Implement approve functionality
  };

  const handleRejectTask = (taskId: string) => {
    console.log(`Rejecting task: ${taskId}`);
    // TODO: Implement reject functionality
  };

  // Table configurations
  const tasksPendingReviewColumns: Column<TaskPendingReview>[] = [
    {
      header: "Task Description",
      accessor: "description",
    },
    {
      header: "Assignee",
      accessor: "assignee",
    },
    {
      header: "Submitted Date",
      accessor: "submittedDate",
    },
    {
      header: "Category",
      accessor: "category",
      cell: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(
            value as string
          )}`}
        >
          {value}
        </span>
      ),
    },
    {
      header: "Difficulty",
      accessor: "difficulty",
      cell: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyBadgeColor(
            value as string
          )}`}
        >
          {value}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "taskId",
      cell: (value) => (
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleApproveTask(value as string)}
            className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
            title="Approve Task"
          >
            <Check size={16} />
          </button>
          <button
            onClick={() => handleRejectTask(value as string)}
            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            title="Reject Task"
          >
            <X size={16} />
          </button>
        </div>
      ),
    },
  ];

  const tasksToBeCompletedColumns: Column<TaskToBeCompleted>[] = [
    {
      header: "Task Description",
      accessor: "description",
    },
    {
      header: "Assignee",
      accessor: "assignee",
    },
    {
      header: "Due Date",
      accessor: "dueDate",
    },
    {
      header: "Category",
      accessor: "category",
      cell: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(
            value as string
          )}`}
        >
          {value}
        </span>
      ),
    },
    {
      header: "Difficulty",
      accessor: "difficulty",
      cell: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyBadgeColor(
            value as string
          )}`}
        >
          {value}
        </span>
      ),
    },
  ];

  const completedTasksColumns: Column<CompletedTask>[] = [
    {
      header: "Task Description",
      accessor: "description",
    },
    {
      header: "Assignee",
      accessor: "assignee",
    },
    {
      header: "Submitted Date",
      accessor: "submittedDate",
    },
    {
      header: "Reviewed Date",
      accessor: "reviewedDate",
    },
    {
      header: "Category",
      accessor: "category",
      cell: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(
            value as string
          )}`}
        >
          {value}
        </span>
      ),
    },
    {
      header: "Difficulty",
      accessor: "difficulty",
      cell: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyBadgeColor(
            value as string
          )}`}
        >
          {value}
        </span>
      ),
    },
    {
      header: "Reward Points",
      accessor: "rewardPoints",
      cell: (value) => (
        <span className="text-verdant-600 font-semibold">{value} pts</span>
      ),
    },
  ];

  const handleCreateTask = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateTaskSubmit = async (
    taskData: TaskFormData
  ): Promise<boolean> => {
    try {
      // TODO: Replace with actual API call
      console.log("Creating task with data:", taskData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate success/failure (for demo purposes, always succeed)
      const success = true; // Math.random() > 0.3; // 70% success rate for demo

      if (success) {
        // TODO: Refresh the task lists after successful creation
        console.log("Task created successfully");
        return true;
      } else {
        console.log("Task creation failed");
        return false;
      }
    } catch (error) {
      console.error("Error creating task:", error);
      return false;
    }
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white mb-6 mt-2">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ClipboardList className="h-8 w-8 text-verdant-600" />
              <div>
                <h1 className="text-3xl font-bold text-shark-950 font-secondary">
                  Task Management
                </h1>
                <p className="text-shark-600 mt-2 font-secondary">
                  Manage and oversee all event tasks and assignments
                </p>
              </div>
            </div>
            <button
              onClick={handleCreateTask}
              className="rounded-full bg-verdant-600 text-white p-3 hover:bg-verdant-700 transition-colors flex items-center gap-2"
              title="Create New Task"
            >
              <Plus size={20} />
              <span className="font-medium">Create Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Task Stats Cards */}
      <div className="px-6 pt-0">
        <div className="flex gap-8 mb-8 justify-start">
          <TaskStatusCard
            count={taskStats.totalTasksPendingReview}
            label="Total Tasks Pending Review"
            subtext="Tasks awaiting approval"
            icon={Eye}
          />
          <TaskStatusCard
            count={taskStats.totalTasksToBeCompleted}
            label="Total Tasks Due"
            subtext="Assigned pending tasks"
            icon={Clock}
          />
          <TaskStatusCard
            count={taskStats.totalTasksCompleted}
            label="Total Tasks Completed"
            subtext="Successfully finished tasks"
            icon={CheckCircle}
          />
        </div>
      </div>

      {/* Tables Section */}
      <div className="px-6 space-y-20 mt-20">
        {/* Tasks Pending Review Table */}
        <div>
          <h2 className="text-2xl font-bold text-shark-950 font-secondary mb-1">
            Tasks Pending Review
          </h2>
          <p className="text-shark-600 mb-4 font-secondary">
            Submitted tasks requiring your review and approval
          </p>
          <Table
            columns={tasksPendingReviewColumns}
            data={tasksPendingReview}
          />
        </div>

        {/* Tasks To Be Completed Table */}
        <div>
          <h2 className="text-2xl font-bold text-shark-950 font-secondary mb-1">
            Tasks To Be Completed
          </h2>
          <p className="text-shark-600 mb-4 font-secondary">
            Assigned tasks that are currently in progress or pending
          </p>
          <Table
            columns={tasksToBeCompletedColumns}
            data={tasksToBeCompleted}
          />
        </div>

        {/* Completed and Reviewed Tasks Table */}
        <div>
          <h2 className="text-2xl font-bold text-shark-950 font-secondary mb-1">
            Completed and Reviewed Tasks
          </h2>
          <p className="text-shark-600 mb-4 font-secondary">
            Successfully completed tasks that have been reviewed and approved
          </p>
          <Table columns={completedTasksColumns} data={completedTasks} />
        </div>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreateTaskSubmit}
      />
    </div>
  );
};

export default EventHostTasksPage;

"use client";

import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  Clock,
  Eye,
  CheckCircle,
  Plus,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import Table, { Column } from "@/components/UI/Table";
import CreateTaskModal, { TaskFormData } from "@/components/UI/CreateTaskModal";
import TaskApprovalModal from "@/components/UI/TaskApprovalModal";
import TaskRejectionModal from "@/components/UI/TaskRejectionModal";
import TaskActionResultModal from "@/components/UI/TaskActionResultModal";
import {
  hostWorkspaceTaskService,
  TaskDTO,
  TaskStatusCount,
  TaskCreateDTO,
} from "@/services/hostWorkspaceTaskService";

// Types for different task states
interface TaskPendingReview {
  taskId: number;
  description: string;
  assignee: string;
  category: string;
  difficulty: string;
  resourceUrl: string;
}

interface TaskToBeCompleted {
  taskId: number;
  description: string;
  assignee: string;
  dueDate: string;
  category: string;
  difficulty: string;
}

interface CompletedTask {
  taskId: number;
  description: string;
  assignee: string;
  category: string;
  difficulty: string;
  rewardPoints: number;
  resourceUrl: string;
}

const EventHostTasksPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const resolvedParams = React.use(params);

  const eventId = Number(resolvedParams.id);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  // Task action states
  const [selectedTask, setSelectedTask] = useState<TaskDTO | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultModal, setResultModal] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  }>({ type: "success", title: "", message: "" });

  // Data states
  const [taskStats, setTaskStats] = useState<TaskStatusCount>({
    IN_PROGRESS: 0,
    TO_DO: 0,
    DONE: 0,
  });
  const [tasksPendingReview, setTasksPendingReview] = useState<TaskDTO[]>([]);
  const [tasksToBeCompleted, setTasksToBeCompleted] = useState<TaskDTO[]>([]);
  const [completedTasks, setCompletedTasks] = useState<TaskDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    loadAllTaskData();
  }, []);

  const loadAllTaskData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadTaskStats(),
        loadTasksPendingReview(),
        loadTasksToBeCompleted(),
        loadCompletedTasks(),
      ]);
    } catch (error) {
      console.error("Error loading task data:", error);
      showResultModal(
        "error",
        "Loading Error",
        "Failed to load task data. Please refresh the page."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadTaskStats = async () => {
    try {
      const stats = await hostWorkspaceTaskService.getTaskStatusCounts(eventId);
      setTaskStats(stats);
    } catch (error) {
      console.error("Error loading task stats:", error);
    }
  };

  const loadTasksPendingReview = async () => {
    try {
      const tasks = await hostWorkspaceTaskService.getTasksByEventAndStatus(
        eventId,
        "IN_PROGRESS"
      );
      setTasksPendingReview(tasks);
    } catch (error) {
      console.error("Error loading tasks pending review:", error);
    }
  };

  const loadTasksToBeCompleted = async () => {
    try {
      const tasks = await hostWorkspaceTaskService.getTasksByEventAndStatus(
        eventId,
        "TO_DO"
      );
      setTasksToBeCompleted(tasks);
    } catch (error) {
      console.error("Error loading tasks to be completed:", error);
    }
  };

  const loadCompletedTasks = async () => {
    try {
      const tasks = await hostWorkspaceTaskService.getTasksByEventAndStatus(
        eventId,
        "DONE"
      );
      setCompletedTasks(tasks);
    } catch (error) {
      console.error("Error loading completed tasks:", error);
    }
  };

  const showResultModal = (
    type: "success" | "error",
    title: string,
    message: string
  ) => {
    setResultModal({ type, title, message });
    setIsResultModalOpen(true);
  };

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
      case "PROGRAM":
        return "bg-shark-200 text-shark-900";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Task approval/rejection handlers
  const handleApproveTask = (task: TaskDTO) => {
    setSelectedTask(task);
    setIsApprovalModalOpen(true);
  };

  const handleRejectTask = (task: TaskDTO) => {
    setSelectedTask(task);
    setIsRejectionModalOpen(true);
  };

  const confirmApproveTask = async () => {
    if (!selectedTask) return;

    setIsProcessing(true);
    try {
      console.log("Approving task:", selectedTask.taskId);

      await hostWorkspaceTaskService.approveTask(selectedTask.taskId);

      showResultModal(
        "success",
        "Task Approved",
        "Task has been successfully approved and marked as completed."
      );
      setIsApprovalModalOpen(false);
      setSelectedTask(null);

      // Refresh data
      await loadAllTaskData();
    } catch (error) {
      console.error("Error approving task:", error);

      // Get more detailed error message
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      showResultModal(
        "error",
        "Approval Failed",
        `Failed to approve task: ${errorMessage}`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmRejectTask = async (
    updatedDescription: string,
    updatedDueDate: string
  ) => {
    if (!selectedTask) return;

    setIsProcessing(true);
    try {
      console.log("Rejecting task:", selectedTask.taskId, {
        updatedDescription,
        updatedDueDate,
      });

      await hostWorkspaceTaskService.rejectTask(
        selectedTask.taskId,
        updatedDescription,
        updatedDueDate
      );

      showResultModal(
        "success",
        "Task Revision Requested",
        "Task has been sent back for revision with your feedback."
      );
      setIsRejectionModalOpen(false);
      setSelectedTask(null);

      // Refresh data
      await loadAllTaskData();
    } catch (error) {
      console.error("Error rejecting task:", error);

      // Get more detailed error message
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      showResultModal(
        "error",
        "Rejection Failed",
        `Failed to process task revision: ${errorMessage}`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Table configurations
  const tasksPendingReviewColumns: Column<TaskDTO>[] = [
    {
      header: "Task Description",
      accessor: "description",
    },
    {
      header: "Assignee",
      accessor: "assigneeUsername",
    },
    {
      header: "Category",
      accessor: "taskCategory",
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
      accessor: "taskDifficulty",
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
      header: "Resource URL",
      accessor: "resourceUrl",
      cell: (value, row) =>
        value ? (
          <a
            href={value as string}
            target="_blank"
            rel="noopener noreferrer"
            className="text-verdant-600 hover:text-verdant-700 flex items-center gap-1"
          >
            <ExternalLink size={16} />
            View Submission
          </a>
        ) : (
          <span className="text-gray-400">No submission</span>
        ),
    },
    {
      header: "Actions",
      accessor: "taskId",
      cell: (value, row) => (
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleApproveTask(row as TaskDTO)}
            className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
            title="Approve Task"
          >
            <Check size={16} />
          </button>
          <button
            onClick={() => handleRejectTask(row as TaskDTO)}
            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            title="Reject Task"
          >
            <X size={16} />
          </button>
        </div>
      ),
    },
  ];

  const tasksToBeCompletedColumns: Column<TaskDTO>[] = [
    {
      header: "Task Description",
      accessor: "description",
    },
    {
      header: "Assignee",
      accessor: "assigneeUsername",
    },
    {
      header: "Due Date",
      accessor: "dueDate",
    },
    {
      header: "Category",
      accessor: "taskCategory",
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
      accessor: "taskDifficulty",
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

  const completedTasksColumns: Column<TaskDTO>[] = [
    {
      header: "Task Description",
      accessor: "description",
    },
    {
      header: "Assignee",
      accessor: "assigneeUsername",
    },
    {
      header: "Category",
      accessor: "taskCategory",
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
      accessor: "taskDifficulty",
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
      header: "Resource URL",
      accessor: "resourceUrl",
      cell: (value) =>
        value ? (
          <a
            href={value as string}
            target="_blank"
            rel="noopener noreferrer"
            className="text-verdant-600 hover:text-verdant-700 flex items-center gap-1"
          >
            <ExternalLink size={16} />
            View Submission
          </a>
        ) : (
          <span className="text-gray-400">No submission</span>
        ),
    },
    {
      header: "Reward Points",
      accessor: "taskRewardPoints",
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
      const createData: TaskCreateDTO = {
        description: taskData.description,
        dueDate: taskData.dueDate, // Already in YYYY-MM-DD format
        taskDifficulty: taskData.difficulty,
        taskCategory: taskData.category,
        assigneeId: taskData.assigneeId,
        eventId: eventId,
      };

      await hostWorkspaceTaskService.createTask(createData);

      // Refresh data after successful creation
      await loadAllTaskData();

      return true;
    } catch (error) {
      console.error("Error creating task:", error);
      return false;
    }
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verdant-600 mx-auto mb-4"></div>
          <p className="text-shark-600 font-secondary">Loading task data...</p>
        </div>
      </div>
    );
  }

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
            count={taskStats.IN_PROGRESS}
            label="Total Tasks Pending Review"
            subtext="Tasks awaiting approval"
            icon={Eye}
          />
          <TaskStatusCard
            count={taskStats.TO_DO}
            label="Total Tasks Due"
            subtext="Assigned pending tasks"
            icon={Clock}
          />
          <TaskStatusCard
            count={taskStats.DONE}
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
        eventId={eventId}
      />

      {/* Task Approval Modal */}
      <TaskApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onConfirm={confirmApproveTask}
        taskDescription={selectedTask?.description || ""}
        isLoading={isProcessing}
      />

      {/* Task Rejection Modal */}
      <TaskRejectionModal
        isOpen={isRejectionModalOpen}
        onClose={() => setIsRejectionModalOpen(false)}
        onConfirm={confirmRejectTask}
        taskDescription={selectedTask?.description || ""}
        currentDueDate={selectedTask?.dueDate || ""}
        isLoading={isProcessing}
      />

      {/* Result Modal */}
      <TaskActionResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        type={resultModal.type}
        title={resultModal.title}
        message={resultModal.message}
      />
    </div>
  );
};

export default EventHostTasksPage;

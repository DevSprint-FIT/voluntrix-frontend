"use client";

import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  Clock,
  Eye,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import {
  WorkspaceTaskService,
  TaskStats,
  ToDoTask,
  TaskInReview,
  CompletedTask,
} from "@/services/volunteerWorkspaceTaskService";
import Table, { Column } from "@/components/UI/Table";

const TasksPage = () => {
  const [taskStats, setTaskStats] = useState<TaskStats>({
    totalTasksDue: 0,
    totalTasksPendingReview: 0,
    totalTasksCompleted: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [toDoTasks, setToDoTasks] = useState<ToDoTask[]>([]);
  const [tasksInReview, setTasksInReview] = useState<TaskInReview[]>([]);
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [tablesLoading, setTablesLoading] = useState(true);

  useEffect(() => {
    const fetchTaskStats = async () => {
      try {
        setIsLoading(true);
        const stats = await WorkspaceTaskService.getTaskStats();
        setTaskStats(stats);
      } catch (error) {
        console.error("Error fetching task stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTableData = async () => {
      try {
        setTablesLoading(true);
        const [toDo, inReview, completed] = await Promise.all([
          WorkspaceTaskService.getToDoTasks(),
          WorkspaceTaskService.getTasksInReview(),
          WorkspaceTaskService.getCompletedTasks(),
        ]);
        setToDoTasks(toDo);
        setTasksInReview(inReview);
        setCompletedTasks(completed);
      } catch (error) {
        console.error("Error fetching table data:", error);
      } finally {
        setTablesLoading(false);
      }
    };

    fetchTaskStats();
    fetchTableData();
  }, []);

  const TaskStatusCard = ({
    count,
    label,
    subtext,
    icon: Icon,
    loading,
  }: {
    count?: number;
    label: string;
    subtext: string;
    icon: React.ElementType;
    loading?: boolean;
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
            {!loading && count !== undefined ? (
              count
            ) : (
              <span className="opacity-0">0</span>
            )}
          </div>
          <p className="font-secondary text-sm text-shark-300">{subtext}</p>
        </div>
      </div>
    );
  };

  // Helper function to get difficulty badge color
  const getDifficultyBadgeColor = (taskDifficulty: string) => {
    switch (taskDifficulty) {
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

  // Helper function to handle task submission
  const handleTaskSubmission = (taskId: string) => {
    // In a real app, this would open a modal or navigate to a submission page
    console.log(`Submitting task with ID: ${taskId}`);
    // You can implement the submission logic here
  };

  // Table configurations
  const toDoTaskColumns: Column<ToDoTask>[] = [
    {
      header: "Task Description",
      accessor: "description",
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
      header: "Due Date",
      accessor: "dueDate",
    },
    {
      header: "Action",
      accessor: "taskId",
      cell: (value) => (
        <button
          onClick={() => handleTaskSubmission(value as string)}
          className="rounded-full bg-verdant-600 text-white font-primary tracking-wider text-sm px-4 py-2 hover:bg-verdant-700 transition-colors"
        >
          Submit
        </button>
      ),
    },
  ];

  const tasksInReviewColumns: Column<TaskInReview>[] = [
    {
      header: "Task Description",
      accessor: "description",
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
      header: "Submitted Date",
      accessor: "taskSubmittedDate",
    },
    {
      header: "Resource URL",
      accessor: "resourceUrl",
      cell: (value) => (
        <a
          href={value as string}
          target="_blank"
          rel="noopener noreferrer"
          className="text-verdant-600 hover:text-verdant-700 flex items-center gap-1"
        >
          <ExternalLink size={16} />
          View Submission
        </a>
      ),
    },
  ];

  const completedTaskColumns: Column<CompletedTask>[] = [
    {
      header: "Task Description",
      accessor: "description",
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
      header: "Submitted Date",
      accessor: "taskSubmittedDate",
    },
    {
      header: "Reviewed Date",
      accessor: "taskReviewedDate",
    },
    {
      header: "Reward Points",
      accessor: "taskRewardPoints",
      cell: (value) => (
        <span className="text-verdant-600 font-semibold">{value} pts</span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white mb-6 mt-2">
        <div className="px-6 py-8">
          <div className="flex items-center space-x-3">
            <ClipboardList className="h-8 w-8 text-verdant-600" />
            <h1 className="text-3xl font-bold text-shark-950 font-secondary">
              Event Tasks
            </h1>
          </div>
          <p className="text-shark-600 mt-2 font-secondary">
            Manage and track all tasks in the event
          </p>
        </div>
      </div>

      {/* Task Stats Cards */}
      <div className="px-6 pt-0">
        <div className="flex gap-8 mb-8 justify-start">
          <TaskStatusCard
            count={taskStats.totalTasksDue}
            loading={isLoading}
            label="Total Tasks Due"
            subtext="Tasks requiring completion"
            icon={Clock}
          />
          <TaskStatusCard
            count={taskStats.totalTasksPendingReview}
            loading={isLoading}
            label="Total Tasks Pending Review"
            subtext="Tasks awaiting review"
            icon={Eye}
          />
          <TaskStatusCard
            count={taskStats.totalTasksCompleted}
            loading={isLoading}
            label="Total Tasks Completed"
            subtext="Successfully completed tasks"
            icon={CheckCircle}
          />
        </div>
      </div>

      {/* Tables Section */}
      <div className="px-6 space-y-20 mt-20">
        {/* To-Do Tasks Table */}
        <div>
          <h2 className="text-2xl font-bold text-shark-950 font-secondary mb-1">
            To-Do Tasks
          </h2>
          <p className="text-shark-600 mb-4 font-secondary">
            Pending tasks that need to be completed
          </p>
          {tablesLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-shark-600">Loading tasks...</div>
            </div>
          ) : (
            <Table columns={toDoTaskColumns} data={toDoTasks} />
          )}
        </div>

        {/* Tasks in Review Table */}
        <div>
          <h2 className="text-2xl font-bold text-shark-950 font-secondary mb-1">
            Tasks in Review
          </h2>
          <p className="text-shark-600 mb-4 font-secondary">
            Submitted tasks awaiting review
          </p>
          {tablesLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-shark-600">Loading tasks...</div>
            </div>
          ) : (
            <Table columns={tasksInReviewColumns} data={tasksInReview} />
          )}
        </div>

        {/* Completed Tasks Table */}
        <div>
          <h2 className="text-2xl font-bold text-shark-950 font-secondary mb-1">
            Completed and Reviewed Tasks
          </h2>
          <p className="text-shark-600 mb-4 font-secondary">
            Successfully completed and reviewed tasks with rewards
          </p>
          {tablesLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-shark-600">Loading tasks...</div>
            </div>
          ) : (
            <Table columns={completedTaskColumns} data={completedTasks} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksPage;

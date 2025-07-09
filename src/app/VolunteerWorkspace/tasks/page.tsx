"use client";

import React, { useState, useEffect } from "react";
import { ClipboardList, Clock, Eye, CheckCircle } from "lucide-react";
import {
  WorkspaceTaskService,
  TaskStats,
} from "@/services/volunteerWorkspaceTaskService";

const TasksPage = () => {
  const [taskStats, setTaskStats] = useState<TaskStats>({
    totalTasksDue: 0,
    totalTasksPendingReview: 0,
    totalTasksCompleted: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

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

    fetchTaskStats();
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
      <div className="px-6 pt-1">
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
    </div>
  );
};

export default TasksPage;

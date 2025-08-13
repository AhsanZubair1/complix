import apiClient from "./index";
import { AxiosResponse } from "axios";

export enum TaskType {
  IMMEDIATE = 1,
  MATERIAL_ADVERSE = 2,
  ANNUAL = 3,
}

export enum TaskStatus {
  PENDING = 1,
  IN_PROGRESS = 2,
  CLOSED = 3,
}

export interface Task {
  id: number;
  created: string;
  modified: string; // ISO date-time string
  title: string; // required
  description: string; // required
  start_date: string; // ISO date-time string, required
  due_date: string; // ISO date-time string, required
  type: TaskType;
  status: TaskStatus;
  created_by: number;
  assigned_to: number; // required
  breach: number | null;
}

export interface TasksResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Task[];
}

export interface TaskQueryParams {
  limit?: number;
  offset?: number;
  search_key?: string;
  status?: number[];
  type?: number[];
  assigned_to?: number[];
  breach_ids?: number[];
}

export interface TaskPayload {
  title: string;
  description: string;
  start_date: string;
  due_date: string;
  type?: TaskType;
  status?: TaskStatus;
  assigned_to: number;
  breach?: number | null;
}

export const getTasks = async (
  params: TaskQueryParams = {}
): Promise<TasksResponse> => {
  const response: AxiosResponse<TasksResponse> = await apiClient.get(
    "/task_service/task/",
    { params }
  );
  return response.data;
};

export const getTask = async (id: number): Promise<Task> => {
  const response: AxiosResponse<Task> = await apiClient.get(
    `/task_service/task/${id}/`
  );
  return response.data;
};

export const createTask = async (payload: TaskPayload): Promise<Task> => {
  const response: AxiosResponse<Task> = await apiClient.post(
    "/task_service/task/",
    payload
  );
  return response.data;
};

export const updateTask = async (
  id: number,
  payload: Partial<TaskPayload>
): Promise<Task> => {
  const response: AxiosResponse<Task> = await apiClient.put(
    `/task_service/task/${id}/`,
    payload
  );
  return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await apiClient.delete(`/task_service/task/${id}/`);
};

export const getTaskStatusDisplay = (status: number): string => {
  return TaskStatus[status] || "Unknown";
};

export const getTaskTypeDisplay = (type: number): string => {
  return TaskType[type] || "Unknown";
};

export const transformTaskToCalendarEvent = (task: Task) => ({
  id: `task_${task.id}`,
  title: task.title,
  description: task.description,
  type: task.type,
  status: task.status,
  start: task.start_date,
  end: task.due_date,
  assigned_to: task.assigned_to,
  breach: task.breach,
});

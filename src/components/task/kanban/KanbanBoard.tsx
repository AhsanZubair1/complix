import { useState, useEffect } from "react";
import useSWR from "swr";
import Column from "./Column";
import { Task as FrontendTask } from "./types/types";
import {
  Task as ApiTask,
  getTasks,
  TaskQueryParams,
  TaskType,
  TaskStatus,
} from "../../../api/TaskApi";

interface KanbanBoardProps {
  searchParams?: TaskQueryParams;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ searchParams = {} }) => {
  const [page, setPage] = useState(1);
  const [allTasks, setAllTasks] = useState<FrontendTask[]>([]);
  const [selectedTaskGroup, setSelectedTaskGroup] = useState<string>("All");

  const fetcher = async (url: string, params: TaskQueryParams) => {
    const response = await getTasks({
      ...params,
      limit: 10,
      offset: (page - 1) * 10,
    });
    return response;
  };

  const { data, error, mutate } = useSWR(
    [
      "/task_service/task/",
      { ...searchParams, limit: 10, offset: (page - 1) * 10 },
    ],
    ([url, params]) => fetcher(url, params),
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    if (data?.results) {
      const mappedTasks: FrontendTask[] = data.results.map((task: ApiTask) => ({
        id: task.id.toString(),
        title: task.title,
        projectDescription: task.description,
        dueDate: task.due_date,
        comments: 0, // API doesn't provide comments
        assignee: `/images/user/user-${task.assigned_to}.jpg`, // Map user ID to image
        status:
          task.status === TaskStatus.PENDING
            ? "todo"
            : task.status === TaskStatus.IN_PROGRESS
            ? "inProgress"
            : "completed",
        category: {
          name:
            task.type === TaskType.IMMEDIATE
              ? "Security"
              : task.type === TaskType.MATERIAL_ADVERSE
              ? "DevOps"
              : "Development",
          color:
            task.type === TaskType.IMMEDIATE
              ? "brand"
              : task.type === TaskType.MATERIAL_ADVERSE
              ? "success"
              : "orange",
        },
      }));
      setAllTasks((prev) =>
        page === 1 ? mappedTasks : [...prev, ...mappedTasks]
      );
    }
  }, [data, page]);

  const taskGroups = [
    { name: "All Tasks", key: "All", count: allTasks.length },
    {
      name: "To do",
      key: "Todo",
      count: allTasks.filter((t) => t.status === "todo").length,
    },
    {
      name: "In Progress",
      key: "InProgress",
      count: allTasks.filter((t) => t.status === "inProgress").length,
    },
    {
      name: "Completed",
      key: "Completed",
      count: allTasks.filter((t) => t.status === "completed").length,
    },
  ];

  const filteredTasks =
    selectedTaskGroup === "All"
      ? allTasks
      : allTasks.filter((task) =>
          selectedTaskGroup === "Todo"
            ? task.status === "todo"
            : selectedTaskGroup === "InProgress"
            ? task.status === "inProgress"
            : task.status === "completed"
        );

  const handleLoadMore = () => {
    if (data?.next) {
      setPage((prev) => prev + 1);
    }
  };

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Failed to load tasks: {error.message}
      </div>
    );
  }

  if (!data && !allTasks.length) {
    return <div className="p-4">Loading tasks...</div>;
  }

  return (
    <div className="p-4 flex flex-col h-full min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="mb-6 grid grid-cols-4 gap-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-900 max-w-[520px] h-[44px] shrink-0">
          {taskGroups.map((group) => (
            <button
              key={group.key}
              onClick={() => setSelectedTaskGroup(group.key)}
              className={`inline-flex items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition-colors h-full 
               text-sm font-medium leading-none ${
                 selectedTaskGroup === group.key
                   ? "bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white"
                   : "text-gray-500 hover:bg-white/50 dark:text-gray-400 dark:hover:bg-gray-800/50"
               }`}
            >
              <span className="truncate">{group.name}</span>
              <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${
                  selectedTaskGroup === group.key
                    ? "bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200"
                    : "bg-white text-xs font-medium dark:bg-gray-700"
                }`}
              >
                {group.count}
              </span>
            </button>
          ))}
        </div>

        {selectedTaskGroup === "All" && (
          <>
            <Column
              title="To Do"
              tasks={filteredTasks.filter((task) => task.status === "todo")}
              status="todo"
              onStatusChange={() => mutate()}
            />
            <Column
              title="In Progress"
              tasks={filteredTasks.filter(
                (task) => task.status === "inProgress"
              )}
              status="inProgress"
              onStatusChange={() => mutate()}
            />
            <Column
              title="Completed"
              tasks={filteredTasks.filter(
                (task) => task.status === "completed"
              )}
              status="completed"
              onStatusChange={() => mutate()}
            />
          </>
        )}

        {selectedTaskGroup === "Todo" && (
          <Column
            title="To Do"
            tasks={filteredTasks.filter((task) => task.status === "todo")}
            status="todo"
            onStatusChange={() => mutate()}
          />
        )}

        {selectedTaskGroup === "InProgress" && (
          <Column
            title="In Progress"
            tasks={filteredTasks.filter((task) => task.status === "inProgress")}
            status="inProgress"
            onStatusChange={() => mutate()}
          />
        )}

        {selectedTaskGroup === "Completed" && (
          <Column
            title="Completed"
            tasks={filteredTasks.filter((task) => task.status === "completed")}
            status="completed"
            onStatusChange={() => mutate()}
          />
        )}

        {data?.next && (
          <button
            onClick={handleLoadMore}
            className="mt-4 w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
          >
            Load More
          </button>
        )}
      </div>
      <div className="h-8 w-full"></div>
    </div>
  );
};

export default KanbanBoard;

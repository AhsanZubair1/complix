import { Task } from "./types/types";

interface TaskItemProps {
  task: Task;
  onStatusChange: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onStatusChange }) => {
  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const formattedTime = task.dueDate
    ? new Date(task.dueDate).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : null;

  return (
    <div className="mb-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 min-h-[64px] flex items-center">
      {/* Drag handle */}
      <button
        type="button"
        className="ml-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
      >
        <svg
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* spacer */}
      <span className="h-3 w-3" />

      {/* Checkbox */}
      <div className="mr-3 flex items-center">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700"
          checked={task.status === "completed"}
          onChange={() => onStatusChange()}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-medium text-gray-900 truncate dark:text-white">
                {task.title}
              </h3>
            </div>
            {task.projectDescription && (
              <p className="mt-1 text-sm font-medium text-gray-500 truncate dark:text-gray-400">
                {task.projectDescription}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2 ml-2">
            {task.category && (
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-sm font-medium whitespace-nowrap ${
                  task.category.color === "brand"
                    ? "bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200"
                    : task.category.color === "success"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : task.category.color === "orange"
                    ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                }`}
              >
                {task.category.name}
              </span>
            )}

            {task.dueDate && (
              <span className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-1 whitespace-nowrap">
                <svg
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>{formattedDate}</span>
                <svg
                  className="h-3 w-3 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{formattedTime}</span>
              </span>
            )}

            {task.assignee && (
              <img
                className="h-6 w-6 rounded-full"
                src={task.assignee}
                alt="Assignee"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;

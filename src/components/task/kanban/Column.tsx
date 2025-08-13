import TaskItem from "./TaskItem";
import { Task } from "./types/types";

interface ColumnProps {
  title: string;
  tasks: Task[];
  status: string;
  onStatusChange: () => void;
}

const Column: React.FC<ColumnProps> = ({
  title,
  tasks,
  status,
  onStatusChange,
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-start shrink-0">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          {title}
        </h2>
        <span className="w-[8px] h-[8px]" />
        <span
          className={`inline-flex h-[21px] w-[22px] items-center justify-center rounded-full ${
            status === "completed"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : status === "inProgress"
              ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          }`}
        >
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3 min-h-0">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onStatusChange={onStatusChange} />
        ))}
      </div>
    </div>
  );
};

export default Column;

import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import TaskHeader from "../../components/task/TaskHeader";
import KanbanBoard from "../../components/task/kanban/KanbanBoard";
import { TaskQueryParams } from "../../api/TaskApi";

export default function Tasks() {
  const [searchParams, setSearchParams] = useState<TaskQueryParams>({});

  const handleSearchChange = (params: TaskQueryParams) => {
    setSearchParams(params);
  };

  return (
    <div className="p-4 h-[calc(100vh-2rem)] flex flex-col">
      <PageBreadcrumb pageTitle="Tasks" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] flex-1 flex flex-col min-h-0">
        <TaskHeader onSearchChange={handleSearchChange} />
        <div className="flex-1 min-h-0 overflow-hidden">
          <KanbanBoard searchParams={searchParams} />
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import Button from "../ui/button/Button";
import AddTaskModal from "./modals/addTask";
import { TaskQueryParams } from "../../api/TaskApi";
interface TaskHeaderProps {
  onSearchChange?: (params: TaskQueryParams) => void;
}

export default function TaskHeader({ onSearchChange }: TaskHeaderProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const [searchKey, setSearchKey] = useState("");

  // Debounce search input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params: TaskQueryParams = {
        search_key: searchKey || undefined,
      };
      if (onSearchChange) onSearchChange(params);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchKey, onSearchChange]);

  return (
    <>
      <div className="flex flex-col items-center px-4 py-5 xl:px-6 xl:py-6">
        <div className="flex flex-col w-full gap-5 sm:justify-between xl:flex-row xl:items-center">
          <div className="flex flex-wrap items-center gap-3 w-full xl:justify-end">
            {/* Search field occupying remaining width */}
            <div className="relative flex-1 max-h-[44px] min-h-[44px]">
              <input
                type="text"
                placeholder="Search..."
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                className="w-full h-[44px] pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Button with fixed dimensions */}
            <div className="max-h-[44px] min-h-[44px]">
              <Button
                size="sm"
                onClick={openModal}
                className="w-[148px] h-[44px]"
              >
                Add New Task
                <svg
                  className="fill-current"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.2502 4.99951C9.2502 4.5853 9.58599 4.24951 10.0002 4.24951C10.4144 4.24951 10.7502 4.5853 10.7502 4.99951V9.24971H15.0006C15.4148 9.24971 15.7506 9.5855 15.7506 9.99971C15.7506 10.4139 15.4148 10.7497 15.0006 10.7497H10.7502V15.0001C10.7502 15.4143 10.4144 15.7501 10.0002 15.7501C9.58599 15.7501 9.2502 15.4143 9.2502 15.0001V10.7497H5C4.58579 10.7497 4.25 10.4139 4.25 9.99971C4.25 9.5855 4.58579 9.24971 5 9.24971H9.2502V4.99951Z"
                    fill=""
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* separator */}
      <div className="h-[1px] w-full bg-gray-200 mb-2" />

      <AddTaskModal
        isOpen={isOpen}
        onClose={closeModal}
        onTaskCreated={() => {}}
        onTaskUpdated={() => {}}
      />
    </>
  );
}

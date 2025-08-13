import { useState, useEffect } from "react";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import TextArea from "../../form/input/TextArea";
import {
  createTask,
  updateTask,
  TaskType,
  TaskStatus,
  TaskPayload,
  Task,
} from "../../../api/TaskApi";
import { mutate } from "swr";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated?: () => void;
  onTaskUpdated?: () => void;
  task?: Task; // Optional task prop for editing
}

interface FormData {
  title: string;
  description: string;
  startDateTime: string;
  dueDateTime: string;
  assignedTo: string;
  type?: string;
  status?: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  startDateTime?: string;
  dueDateTime?: string;
  assignedTo?: string;
}

export default function AddTaskModal({
  isOpen,
  onClose,
  onTaskCreated,
  onTaskUpdated,
  task,
}: AddTaskModalProps) {
  const isEditing = !!task; // Determine if we're editing based on task prop

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    startDateTime: "",
    dueDateTime: "",
    assignedTo: "",
    type: "",
    status: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with task data if editing
  useEffect(() => {
    if (task) {
      const typeMap: Record<TaskType, string> = {
        [TaskType.IMMEDIATE]: "Marketing",
        [TaskType.MATERIAL_ADVERSE]: "Template",
        [TaskType.ANNUAL]: "Development",
      };

      const statusMap: Record<TaskStatus, string> = {
        [TaskStatus.PENDING]: "To Do",
        [TaskStatus.IN_PROGRESS]: "In Progress",
        [TaskStatus.CLOSED]: "Completed",
      };

      const assigneeMap: Record<number, string> = {
        1: "Mayad Ahmed",
        2: "Juhan Ahamed",
        3: "Mahim Ahmed",
      };

      setFormData({
        title: task.title,
        description: task.description,
        startDateTime: task.start_date.slice(0, 16), // Convert ISO to datetime-local format
        dueDateTime: task.due_date.slice(0, 16),
        assignedTo: assigneeMap[task.assigned_to] || "",
        type: typeMap[task.type] || "",
        status: statusMap[task.status] || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        startDateTime: "",
        dueDateTime: "",
        assignedTo: "",
        type: "",
        status: "",
      });
    }
  }, [task]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.startDateTime)
      newErrors.startDateTime = "Start date and time are required";
    if (!formData.dueDateTime)
      newErrors.dueDateTime = "Due date and time are required";
    if (!formData.assignedTo) newErrors.assignedTo = "Assignee is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mapFormDataToApiPayload = (formData: FormData): TaskPayload => {
    const startDateTime = new Date(
      `${formData.startDateTime}:00`
    ).toISOString();
    const dueDateTime = new Date(`${formData.dueDateTime}:00`).toISOString();

    const taskTypeMap: Record<string, TaskType> = {
      Marketing: TaskType.IMMEDIATE,
      Template: TaskType.MATERIAL_ADVERSE,
      Development: TaskType.ANNUAL,
    };

    const statusMap: Record<string, TaskStatus> = {
      "To Do": TaskStatus.PENDING,
      "In Progress": TaskStatus.IN_PROGRESS,
      Completed: TaskStatus.CLOSED,
    };

    const assigneeMap: Record<string, number> = {
      "Mayad Ahmed": 1,
      "Juhan Ahamed": 2,
      "Mahim Ahmed": 3,
    };

    return {
      title: formData.title,
      description: formData.description,
      start_date: startDateTime,
      due_date: dueDateTime,
      assigned_to: assigneeMap[formData.assignedTo] || 1,
      ...(formData.type && { type: taskTypeMap[formData.type] }),
      ...(formData.status && { status: statusMap[formData.status] }),
      breach: null,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = mapFormDataToApiPayload(formData);
      if (isEditing && task?.id) {
        await updateTask(task.id, payload);
        await mutate("/task_service/task/");
        onClose();
        if (onTaskUpdated) onTaskUpdated();
      } else {
        await createTask(payload);
        await mutate("/task_service/task/");
        onClose();
        if (onTaskCreated) onTaskCreated();
      }
    } catch (error) {
      console.error(
        `Failed to ${isEditing ? "update" : "create"} task:`,
        error
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.33317 0.0830078C4.74738 0.0830078 5.08317 0.418794 5.08317 0.833008V1.24967H8.9165V0.833008C8.9165 0.418794 9.25229 0.0830078 9.6665 0.0830078C10.0807 0.0830078 10.4165 0.418794 10.4165 0.833008V1.24967L11.3332 1.24967C12.2997 1.24967 13.0832 2.03318 13.0832 2.99967V4.99967V11.6663C13.0832 12.6328 12.2997 13.4163 11.3332 13.4163H2.6665C1.70001 13.4163 0.916504 12.6328 0.916504 11.6663V4.99967V2.99967C0.916504 2.03318 1.70001 1.24967 2.6665 1.24967L3.58317 1.24967V0.833008C3.58317 0.418794 3.91896 0.0830078 4.33317 0.0830078ZM4.33317 2.74967H2.6665C2.52843 2.74967 2.4165 2.8616 2.4165 2.99967V4.24967H11.5832V2.99967C11.5832 2.8616 11.4712 2.74967 11.3332 2.74967H9.6665H4.33317ZM11.5832 5.74967H2.4165V11.6663C2.4165 11.8044 2.52843 11.9163 2.6665 11.9163H11.3332C11.4712 11.9163 11.5832 11.8044 11.5832 11.6663V5.74967Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[700px] p-5 lg:p-10 m-4"
    >
      <div className="px-2">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {isEditing ? "Edit Task" : "Add New Task"}
        </h4>
      </div>

      <div className="h-5 w-full" />

      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2">
          <div className="sm:col-span-2">
            <Label>
              Task Name <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="h-5 w-full" />

          <div>
            <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Task Type
            </Label>
            <div className="relative z-20 bg-transparent dark:bg-form-input">
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              >
                <option value="">Select task type (optional)</option>
                <option value="Marketing">Marketing</option>
                <option value="Template">Template</option>
                <option value="Development">Development</option>
              </select>
              <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-4 top-1/2 dark:text-gray-400">
                <svg
                  className="stroke-current"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
                    stroke=""
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div className="h-5 w-full" />

          <div>
            <Label>Status</Label>
            <div className="relative z-20 bg-transparent dark:bg-form-input">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              >
                <option value="">Select status (optional)</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-4 top-1/2 dark:text-gray-400">
                <svg
                  className="stroke-current"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
                    stroke=""
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div className="h-5 w-full" />

          <div className="space-y-2">
            <Label>
              Start Date and Time <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                type="datetime-local"
                name="startDateTime"
                value={formData.startDateTime}
                onChange={handleChange}
                className={`w-full pr-10 ${
                  errors.startDateTime ? "border-red-500" : ""
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <CalendarIcon className="h-4 w-4 text-gray-500" />
              </span>
            </div>
            {errors.startDateTime && (
              <p className="text-sm text-red-500">{errors.startDateTime}</p>
            )}
          </div>

          <div className="h-5 w-full" />

          <div className="space-y-2">
            <Label>
              Due Date and Time <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                type="datetime-local"
                name="dueDateTime"
                value={formData.dueDateTime}
                onChange={handleChange}
                className={`w-full pr-10 ${
                  errors.dueDateTime ? "border-red-500" : ""
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <CalendarIcon className="h-4 w-4 text-gray-500" />
              </span>
            </div>
            {errors.dueDateTime && (
              <p className="text-sm text-red-500">{errors.dueDateTime}</p>
            )}
          </div>

          <div className="h-5 w-full" />

          <div>
            <Label>
              Assignee <span className="text-red-500">*</span>
            </Label>
            <div className="relative z-20 bg-transparent dark:bg-form-input">
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className={`dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border ${
                  errors.assignedTo ? "border-red-500" : "border-gray-300"
                } bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
              >
                <option value="">Select assignee</option>
                <option value="Mayad Ahmed">Mayad Ahmed</option>
                <option value="Juhan Ahamed">Juhan Ahamed</option>
                <option value="Mahim Ahmed">Mahim Ahmed</option>
              </select>
              <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-4 top-1/2 dark:text-gray-400">
                <svg
                  className="stroke-current"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
                    stroke=""
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
            {errors.assignedTo && (
              <p className="mt-1 text-sm text-red-500">{errors.assignedTo}</p>
            )}
          </div>

          <div className="h-5 w-full" />

          <div className="sm:col-span-2">
            <Label>
              Description <span className="text-red-500">*</span>
            </Label>
            <TextArea
              name="description"
              placeholder="Type your description here..."
              rows={6}
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="h-5 w-full" />
        </div>

        <div className="flex flex-col items-center gap-6 px-2 mt-6 sm:flex-row sm:justify-end">
          <div className="flex items-center w-full gap-3 sm:w-auto">
            <button
              onClick={onClose}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                ? "Update"
                : "Add"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

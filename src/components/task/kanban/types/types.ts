export interface Task {
  id: string;
  title: string;
  projectDescription?: string;
  dueDate?: string;
  comments?: number;
  assignee?: string;
  status: "todo" | "inProgress" | "completed";
  category: {
    name: string;
    color: "brand" | "success" | "orange" | "default";
  };
  links?: number;
  projectImg?: string;
}

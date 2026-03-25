export type TaskPriority = "low" | "medium" | "high";

export type ColumnId = "todo" | "in-progress" | "review" | "done";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  columnId: ColumnId;
  createdAt: string;
  assignee?: string;
  tags?: string[];
}

export interface Column {
  id: ColumnId;
  title: string;
  color: string;
}

export const COLUMNS: Column[] = [
  { id: "todo", title: "To Do", color: "bg-slate-100 dark:bg-slate-800" },
  { id: "in-progress", title: "In Progress", color: "bg-blue-50 dark:bg-blue-950" },
  { id: "review", title: "In Review", color: "bg-amber-50 dark:bg-amber-950" },
  { id: "done", title: "Done", color: "bg-green-50 dark:bg-green-950" },
];

export const MOCK_CREDENTIALS = {
  email: "demo@taskflow.com",
  password: "demo1234",
};

export type Priority = "low" | "medium" | "high";

export type ColumnId = "todo" | "in-progress" | "review" | "done";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  columnId: ColumnId;
  createdAt: string;
  tags?: string[];
}

export interface Column {
  id: ColumnId;
  title: string;
  color: string;
}

export const COLUMNS: Column[] = [
  { id: "todo", title: "To Do", color: "bg-slate-500" },
  { id: "in-progress", title: "In Progress", color: "bg-blue-500" },
  { id: "review", title: "Review", color: "bg-amber-500" },
  { id: "done", title: "Done", color: "bg-green-500" },
];

export const MOCK_CREDENTIALS = {
  email: "demo@example.com",
  password: "demo1234",
};

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task, ColumnId, TaskPriority } from "@/types";

const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    title: "Design system setup",
    description: "Configure design tokens and component library",
    priority: "high",
    columnId: "done",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    tags: ["design", "setup"],
  },
  {
    id: "2",
    title: "Authentication flow",
    description: "Implement login and session management",
    priority: "high",
    columnId: "done",
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    tags: ["auth"],
  },
  {
    id: "3",
    title: "Kanban board UI",
    description: "Build drag-and-drop kanban columns",
    priority: "high",
    columnId: "in-progress",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    tags: ["ui", "kanban"],
  },
  {
    id: "4",
    title: "API integration",
    description: "Connect frontend to backend API endpoints",
    priority: "medium",
    columnId: "in-progress",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    tags: ["api"],
  },
  {
    id: "5",
    title: "Task filtering",
    description: "Add filter by priority and tags",
    priority: "medium",
    columnId: "review",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    tags: ["feature"],
  },
  {
    id: "6",
    title: "Write unit tests",
    description: "Test coverage for core components",
    priority: "low",
    columnId: "todo",
    createdAt: new Date().toISOString(),
    tags: ["testing"],
  },
  {
    id: "7",
    title: "Performance optimization",
    description: "Reduce bundle size and improve load times",
    priority: "low",
    columnId: "todo",
    createdAt: new Date().toISOString(),
    tags: ["performance"],
  },
  {
    id: "8",
    title: "Dark mode support",
    description: "Implement theme switching",
    priority: "medium",
    columnId: "todo",
    createdAt: new Date().toISOString(),
    tags: ["ui"],
  },
];

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, targetColumnId: ColumnId) => void;
  reorderTask: (
    taskId: string,
    targetColumnId: ColumnId,
    targetIndex: number
  ) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: INITIAL_TASKS,
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
      moveTask: (taskId, targetColumnId) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, columnId: targetColumnId } : t
          ),
        })),
      reorderTask: (taskId, targetColumnId, targetIndex) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === taskId);
          if (!task) return state;
          const otherTasks = state.tasks.filter((t) => t.id !== taskId);
          const columnTasks = otherTasks.filter(
            (t) => t.columnId === targetColumnId
          );
          const nonColumnTasks = otherTasks.filter(
            (t) => t.columnId !== targetColumnId
          );
          const updatedTask = { ...task, columnId: targetColumnId };
          columnTasks.splice(targetIndex, 0, updatedTask);
          return { tasks: [...nonColumnTasks, ...columnTasks] };
        }),
    }),
    { name: "task-store" }
  )
);

export type { TaskPriority };

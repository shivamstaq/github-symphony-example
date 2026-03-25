import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Todo, ColumnId } from "@/lib/types";

interface TodoState {
  todos: Todo[];
  addTodo: (todo: Omit<Todo, "id" | "createdAt">) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  moveTodo: (id: string, columnId: ColumnId) => void;
  reorderTodos: (todos: Todo[]) => void;
}

const INITIAL_TODOS: Todo[] = [
  {
    id: "1",
    title: "Set up project structure",
    description: "Initialize Next.js with TypeScript and configure dependencies",
    priority: "high",
    columnId: "done",
    createdAt: new Date().toISOString(),
    tags: ["setup"],
  },
  {
    id: "2",
    title: "Design database schema",
    description: "Create ERD and define data models",
    priority: "high",
    columnId: "in-progress",
    createdAt: new Date().toISOString(),
    tags: ["backend", "database"],
  },
  {
    id: "3",
    title: "Build authentication UI",
    description: "Login and signup pages with form validation",
    priority: "medium",
    columnId: "review",
    createdAt: new Date().toISOString(),
    tags: ["frontend", "auth"],
  },
  {
    id: "4",
    title: "Write unit tests",
    description: "Test coverage for core business logic",
    priority: "medium",
    columnId: "todo",
    createdAt: new Date().toISOString(),
    tags: ["testing"],
  },
  {
    id: "5",
    title: "Set up CI/CD pipeline",
    description: "Configure GitHub Actions for automated deployments",
    priority: "low",
    columnId: "todo",
    createdAt: new Date().toISOString(),
    tags: ["devops"],
  },
];

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: INITIAL_TODOS,
      addTodo: (todo) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              ...todo,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      updateTodo: (id, updates) =>
        set((state) => ({
          todos: state.todos.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      deleteTodo: (id) =>
        set((state) => ({ todos: state.todos.filter((t) => t.id !== id) })),
      moveTodo: (id, columnId) =>
        set((state) => ({
          todos: state.todos.map((t) => (t.id === id ? { ...t, columnId } : t)),
        })),
      reorderTodos: (todos) => set({ todos }),
    }),
    { name: "todos-storage" }
  )
);

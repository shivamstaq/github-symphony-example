"use client";

import { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { COLUMNS, ColumnId } from "@/lib/types";
import { useTodoStore } from "@/store/todoStore";
import { useAuthStore } from "@/store/authStore";
import { KanbanColumn } from "./KanbanColumn";
import { AddTodoDialog } from "./AddTodoDialog";

export function KanbanBoard() {
  const todos = useTodoStore((s) => s.todos);
  const reorderTodos = useTodoStore((s) => s.reorderTodos);
  const moveTodo = useTodoStore((s) => s.moveTodo);
  const { user, logout } = useAuthStore();
  const [addOpen, setAddOpen] = useState(false);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const destColumnId = destination.droppableId as ColumnId;

    if (source.droppableId !== destination.droppableId) {
      moveTodo(draggableId, destColumnId);
    } else {
      // Reorder within same column
      const colTodos = todos.filter((t) => t.columnId === destColumnId);
      const otherTodos = todos.filter((t) => t.columnId !== destColumnId);
      const moved = colTodos.splice(source.index, 1)[0];
      colTodos.splice(destination.index, 0, moved);
      reorderTodos([...otherTodos, ...colTodos]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-white font-semibold">KanFlow</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 text-sm">My Board</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-1.5 text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
              <div className="w-7 h-7 rounded-full bg-purple-700 flex items-center justify-center text-white text-xs font-semibold">
                {user?.email[0].toUpperCase()}
              </div>
              <span className="text-slate-400 text-sm hidden sm:block">{user?.email}</span>
              <button
                onClick={logout}
                className="text-slate-400 hover:text-slate-200 transition-colors ml-1"
                title="Sign out"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Board */}
      <main className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Project Board</h1>
            <p className="text-slate-400 text-sm mt-0.5">{todos.length} tasks across {COLUMNS.length} columns</p>
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                todos={todos.filter((t) => t.columnId === column.id)}
              />
            ))}
          </div>
        </DragDropContext>
      </main>

      <AddTodoDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}

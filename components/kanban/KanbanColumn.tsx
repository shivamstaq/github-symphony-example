"use client";

import { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Column, Todo } from "@/lib/types";
import { TodoCard } from "./TodoCard";
import { AddTodoDialog } from "./AddTodoDialog";

interface KanbanColumnProps {
  column: Column;
  todos: Todo[];
}

export function KanbanColumn({ column, todos }: KanbanColumnProps) {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col w-72 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${column.color}`} />
            <h2 className="text-sm font-semibold text-slate-200">{column.title}</h2>
            <span className="text-xs text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
              {todos.length}
            </span>
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-purple-400 hover:bg-purple-900/30 transition-colors"
            aria-label="Add task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex-1 rounded-xl p-2 min-h-[200px] transition-colors duration-150 ${
                snapshot.isDraggingOver
                  ? "bg-purple-900/20 ring-1 ring-purple-500/40"
                  : "bg-slate-800/30"
              }`}
            >
              {todos.map((todo, index) => (
                <TodoCard key={todo.id} todo={todo} index={index} />
              ))}
              {provided.placeholder}
              {todos.length === 0 && !snapshot.isDraggingOver && (
                <div className="flex flex-col items-center justify-center h-24 text-slate-600 text-xs gap-2">
                  <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Drop tasks here</span>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </div>
      <AddTodoDialog
        open={addOpen}
        defaultColumnId={column.id}
        onClose={() => setAddOpen(false)}
      />
    </>
  );
}

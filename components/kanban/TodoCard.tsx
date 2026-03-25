"use client";

import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Todo, Priority } from "@/lib/types";
import { useTodoStore } from "@/store/todoStore";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EditTodoDialog } from "./EditTodoDialog";

const PRIORITY_COLORS: Record<Priority, string> = {
  low: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  medium: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  high: "bg-red-500/20 text-red-300 border-red-500/30",
};

const PRIORITY_DOT: Record<Priority, string> = {
  low: "bg-slate-400",
  medium: "bg-amber-400",
  high: "bg-red-400",
};

interface TodoCardProps {
  todo: Todo;
  index: number;
}

export function TodoCard({ todo, index }: TodoCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const deleteTodo = useTodoStore((s) => s.deleteTodo);

  return (
    <>
      <Draggable draggableId={todo.id} index={index}>
        {(provided, snapshot) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`group mb-2 border-0 bg-slate-800 cursor-grab active:cursor-grabbing transition-all duration-150 ${
              snapshot.isDragging
                ? "shadow-xl shadow-purple-900/30 scale-[1.02] ring-1 ring-purple-500/50"
                : "hover:bg-slate-750 hover:shadow-md hover:shadow-slate-900/50"
            }`}
          >
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-medium text-slate-100 leading-snug flex-1">
                  {todo.title}
                </h3>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => setEditOpen(true)}
                    className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
                    aria-label="Edit"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-900/30 transition-colors"
                    aria-label="Delete"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {todo.description && (
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {todo.description}
                </p>
              )}

              <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[todo.priority]}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[todo.priority]}`} />
                  {todo.priority}
                </span>
                {todo.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs px-1.5 py-0 h-5 border-slate-600 text-slate-400 bg-transparent"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </Draggable>
      <EditTodoDialog todo={todo} open={editOpen} onClose={() => setEditOpen(false)} />
    </>
  );
}

"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types";
import { useTaskStore } from "@/store/task-store";
import { Badge } from "@/components/ui/badge";
import { EditTaskDialog } from "@/components/edit-task-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  GripVertical,
  MoreHorizontal,
  Pencil,
  Trash2,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";

const priorityConfig = {
  high: {
    label: "High",
    className:
      "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400 border-red-200 dark:border-red-900",
    dot: "bg-red-500",
  },
  medium: {
    label: "Medium",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 dark:border-amber-900",
    dot: "bg-amber-500",
  },
  low: {
    label: "Low",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
    dot: "bg-emerald-500",
  },
};

interface TaskCardProps {
  task: Task;
  overlay?: boolean;
}

export function TaskCard({ task, overlay = false }: TaskCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const priority = priorityConfig[task.priority];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "group relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm",
          "hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-150",
          isDragging && "opacity-40 shadow-lg",
          overlay && "shadow-2xl rotate-2 opacity-95 cursor-grabbing"
        )}
      >
        <div className="p-3.5 space-y-2.5">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-1.5 min-w-0">
              <button
                {...attributes}
                {...listeners}
                className="mt-0.5 p-0.5 rounded text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 cursor-grab active:cursor-grabbing transition-colors shrink-0"
                aria-label="Drag task"
              >
                <GripVertical className="w-3.5 h-3.5" />
              </button>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100 leading-snug line-clamp-2">
                {task.title}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 inline-flex items-center justify-center rounded-md"
                aria-label="Task options"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Pencil className="w-3.5 h-3.5 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => deleteTask(task.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 pl-5">
              {task.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between gap-2 pl-5">
            <div className="flex flex-wrap gap-1">
              {task.tags?.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-[10px] h-4 px-1.5 font-medium bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <Badge
              variant="outline"
              className={cn("text-[10px] h-5 px-1.5 shrink-0 flex items-center gap-1 font-medium border", priority.className)}
            >
              <Flag className="w-2.5 h-2.5" />
              {priority.label}
            </Badge>
          </div>
        </div>
      </div>
      <EditTaskDialog task={task} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}

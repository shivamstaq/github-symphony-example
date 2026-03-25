"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Column, Task } from "@/types";
import { TaskCard } from "@/components/task-card";
import { AddTaskDialog } from "@/components/add-task-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const columnAccentMap: Record<string, string> = {
  todo: "border-t-slate-400",
  "in-progress": "border-t-blue-500",
  review: "border-t-amber-500",
  done: "border-t-emerald-500",
};

const columnBadgeMap: Record<string, string> = {
  todo: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  "in-progress": "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
  review: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
  done: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
};

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
}

export function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const [addOpen, setAddOpen] = useState(false);

  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <>
      <div
        className={cn(
          "flex flex-col w-72 shrink-0 rounded-xl border-t-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 transition-colors",
          columnAccentMap[column.id],
          isOver && "bg-blue-50/60 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900"
        )}
      >
        {/* Column header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {column.title}
            </h3>
            <Badge
              variant="secondary"
              className={cn(
                "text-xs h-5 min-w-5 px-1.5 font-semibold",
                columnBadgeMap[column.id]
              )}
            >
              {tasks.length}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
            onClick={() => setAddOpen(true)}
            aria-label={`Add task to ${column.title}`}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Task list */}
        <div
          ref={setNodeRef}
          className={cn(
            "flex-1 px-3 pb-3 space-y-2 min-h-[120px] transition-colors rounded-b-xl",
            isOver && "bg-blue-50/40 dark:bg-blue-950/10"
          )}
        >
          <SortableContext
            items={tasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SortableContext>
          {tasks.length === 0 && (
            <div className="flex items-center justify-center h-24 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-400 dark:text-slate-600">
                Drop tasks here
              </p>
            </div>
          )}
        </div>
      </div>

      <AddTaskDialog
        columnId={column.id}
        open={addOpen}
        onOpenChange={setAddOpen}
      />
    </>
  );
}

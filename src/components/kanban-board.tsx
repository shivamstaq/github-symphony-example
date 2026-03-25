"use client";

import { useState, useMemo } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useTaskStore } from "@/store/task-store";
import { KanbanColumn } from "@/components/kanban-column";
import { TaskCard } from "@/components/task-card";
import { COLUMNS, ColumnId, Task } from "@/types";

export function KanbanBoard() {
  const { tasks, reorderTask, moveTask } = useTaskStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const columnTasks = useMemo(() => {
    const map: Record<ColumnId, Task[]> = {
      todo: [],
      "in-progress": [],
      review: [],
      done: [],
    };
    tasks.forEach((task) => {
      map[task.columnId].push(task);
    });
    return map;
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // Dragging over a column
    const isOverColumn = COLUMNS.some((c) => c.id === overId);
    if (isOverColumn && activeTask.columnId !== overId) {
      moveTask(activeId, overId as ColumnId);
      return;
    }

    // Dragging over another task
    const overTask = tasks.find((t) => t.id === overId);
    if (!overTask) return;

    if (activeTask.columnId !== overTask.columnId) {
      moveTask(activeId, overTask.columnId);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);

    if (!activeTask) return;

    const targetColumnId = overTask
      ? overTask.columnId
      : (overId as ColumnId);

    const colTasks = columnTasks[targetColumnId];
    const oldIndex = colTasks.findIndex((t) => t.id === activeId);
    const newIndex = overTask
      ? colTasks.findIndex((t) => t.id === overId)
      : colTasks.length;

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(colTasks, oldIndex, newIndex);
      reorderTask(activeId, targetColumnId, reordered.findIndex((t) => t.id === activeId));
    } else {
      moveTask(activeId, targetColumnId);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 px-1">
        {COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={columnTasks[column.id]}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask && <TaskCard task={activeTask} overlay />}
      </DragOverlay>
    </DndContext>
  );
}

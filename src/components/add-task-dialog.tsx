"use client";

import { useState } from "react";
import { useTaskStore } from "@/store/task-store";
import { ColumnId, TaskPriority } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AddTaskDialogProps {
  columnId: ColumnId;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const priorities: { value: TaskPriority; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100" },
  { value: "medium", label: "Medium", color: "text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100" },
  { value: "high", label: "High", color: "text-red-600 bg-red-50 border-red-200 hover:bg-red-100" },
];

export function AddTaskDialog({
  columnId,
  open,
  onOpenChange,
}: AddTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [tagsInput, setTagsInput] = useState("");

  const addTask = useTaskStore((s) => s.addTask);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    addTask({ title: title.trim(), description: description.trim(), priority, columnId, tags });
    setTitle("");
    setDescription("");
    setPriority("medium");
    setTagsInput("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              autoFocus
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="desc">Description</Label>
            <Input
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Priority</Label>
            <div className="flex gap-2">
              {priorities.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={cn(
                    "flex-1 rounded-lg border text-xs font-medium py-1.5 transition-colors",
                    p.color,
                    priority === p.value
                      ? "ring-2 ring-offset-1 ring-current"
                      : "opacity-70 hover:opacity-100"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tags">Tags <span className="text-xs text-slate-400">(comma separated)</span></Label>
            <Input
              id="tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. frontend, bug, design"
            />
          </div>
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Add Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

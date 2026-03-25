"use client";

import { useState } from "react";
import { useTaskStore } from "@/store/task-store";
import { Task, TaskPriority } from "@/types";
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

interface EditTaskDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const priorities: { value: TaskPriority; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100" },
  { value: "medium", label: "Medium", color: "text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100" },
  { value: "high", label: "High", color: "text-red-600 bg-red-50 border-red-200 hover:bg-red-100" },
];

export function EditTaskDialog({ task, open, onOpenChange }: EditTaskDialogProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [tagsInput, setTagsInput] = useState(task.tags?.join(", ") ?? "");

  const updateTask = useTaskStore((s) => s.updateTask);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!title.trim()) return;
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    updateTask(task.id, { title: title.trim(), description: description.trim(), priority, tags });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-title">Title <span className="text-destructive">*</span></Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-desc">Description</Label>
            <Input
              id="edit-desc"
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
            <Label htmlFor="edit-tags">Tags <span className="text-xs text-slate-400">(comma separated)</span></Label>
            <Input
              id="edit-tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. frontend, bug"
            />
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

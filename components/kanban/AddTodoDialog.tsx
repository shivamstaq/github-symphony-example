"use client";

import { useState } from "react";
import { Priority, ColumnId, COLUMNS } from "@/lib/types";
import { useTodoStore } from "@/store/todoStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface AddTodoDialogProps {
  open: boolean;
  defaultColumnId?: ColumnId;
  onClose: () => void;
}

export function AddTodoDialog({ open, defaultColumnId = "todo", onClose }: AddTodoDialogProps) {
  const addTodo = useTodoStore((s) => s.addTodo);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [columnId, setColumnId] = useState<ColumnId>(defaultColumnId);
  const [tags, setTags] = useState("");

  const handleAdd = () => {
    if (!title.trim()) return;
    addTodo({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      columnId,
      tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    });
    setTitle("");
    setDescription("");
    setPriority("medium");
    setTags("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-slate-300">Title *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
              placeholder="Task title"
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-slate-300">Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
              placeholder="Optional description"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-slate-300">Priority</Label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full h-9 rounded-md border border-slate-700 bg-slate-800 text-white px-3 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300">Column</Label>
              <select
                value={columnId}
                onChange={(e) => setColumnId(e.target.value as ColumnId)}
                className="w-full h-9 rounded-md border border-slate-700 bg-slate-800 text-white px-3 text-sm"
              >
                {COLUMNS.map((col) => (
                  <option key={col.id} value={col.id}>{col.title}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-slate-300">Tags (comma separated)</Label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
              placeholder="e.g. frontend, backend"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="text-slate-300 hover:text-white hover:bg-slate-800">
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!title.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
          >
            Add Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { useTaskStore } from "@/store/task-store";
import { KanbanBoard } from "@/components/kanban-board";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kanban, LogOut, ChevronDown, LayoutGrid } from "lucide-react";

export default function BoardPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const tasks = useTaskStore((s) => s.tasks);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.columnId === "done").length;
  const inProgressTasks = tasks.filter((t) => t.columnId === "in-progress").length;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600">
              <Kanban className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              TaskFlow
            </span>
            <Separator orientation="vertical" className="h-4 mx-1" />
            <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
              <LayoutGrid className="w-3.5 h-3.5" />
              Board
            </span>
          </div>

          {/* Stats */}
          <div className="hidden sm:flex items-center gap-3">
            <Badge variant="secondary" className="text-xs gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
              {inProgressTasks} in progress
            </Badge>
            <Badge variant="secondary" className="text-xs gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              {doneTasks}/{totalTasks} done
            </Badge>
          </div>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-[10px] font-semibold bg-gradient-to-br from-indigo-400 to-blue-500 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline font-medium text-slate-700 dark:text-slate-200">
                {user.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-3 py-2">
                <p className="text-xs font-medium text-slate-500">Signed in as</p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                  {user.email}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="text-destructive focus:text-destructive gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 sm:px-6 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            My Board
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Drag and drop tasks between columns to update their status
          </p>
        </div>
        <KanbanBoard />
      </main>
    </div>
  );
}

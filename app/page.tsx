"use client";

import { useAuthStore } from "@/store/authStore";
import { LoginForm } from "@/components/auth/LoginForm";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";

export default function Home() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <KanbanBoard /> : <LoginForm />;
}

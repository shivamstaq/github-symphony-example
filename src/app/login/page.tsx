"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { MOCK_CREDENTIALS } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Kanban, Copy, CheckCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<"email" | "password" | null>(null);

  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const ok = login(email, password);
    if (ok) {
      router.push("/board");
    } else {
      setError("Invalid email or password.");
    }
    setLoading(false);
  };

  const copyToClipboard = async (text: string, field: "email" | "password") => {
    await navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const fillCredentials = () => {
    setEmail(MOCK_CREDENTIALS.email);
    setPassword(MOCK_CREDENTIALS.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
            <Kanban className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              TaskFlow
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Kanban-style task management
            </p>
          </div>
        </div>

        {/* Demo credentials card */}
        <Card className="border-dashed border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/30">
          <CardHeader className="pb-3 pt-4 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                Demo Credentials
              </CardTitle>
              <Badge
                variant="secondary"
                className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
              >
                Mock Auth
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            <div className="flex items-center justify-between rounded-lg bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900 px-3 py-2">
              <div className="min-w-0">
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  Email
                </p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                  {MOCK_CREDENTIALS.email}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(MOCK_CREDENTIALS.email, "email")
                }
                className="ml-2 p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                {copied === "email" ? (
                  <CheckCheck className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900 px-3 py-2">
              <div className="min-w-0">
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  Password
                </p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {MOCK_CREDENTIALS.password}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(MOCK_CREDENTIALS.password, "password")
                }
                className="ml-2 p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                {copied === "password" ? (
                  <CheckCheck className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <button
              type="button"
              onClick={fillCredentials}
              className="w-full text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 py-1 transition-colors"
            >
              Auto-fill credentials →
            </button>
          </CardContent>
        </Card>

        {/* Login form */}
        <Card className="shadow-xl shadow-slate-200/60 dark:shadow-slate-900/40 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Sign in</CardTitle>
            <CardDescription>
              Enter your credentials to access your board
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-10"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-10 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/30"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

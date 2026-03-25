"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { MOCK_CREDENTIALS } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const login = useAuthStore((s) => s.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const ok = login(email, password);
    if (!ok) setError("Invalid credentials. Use the credentials shown below.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-4">
      <div className="w-full max-w-md space-y-4">
        <Card className="border-0 shadow-2xl bg-slate-900/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-purple-400 font-semibold text-sm tracking-wider uppercase">KanFlow</span>
            </div>
            <CardTitle className="text-2xl font-bold text-white">Welcome back</CardTitle>
            <CardDescription className="text-slate-400">Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium"
              >
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border border-purple-800/50 bg-purple-950/30 backdrop-blur-sm">
          <CardContent className="pt-4">
            <p className="text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">Demo Credentials</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Email</span>
                <code className="text-purple-300 text-sm bg-slate-800 px-2 py-0.5 rounded">{MOCK_CREDENTIALS.email}</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Password</span>
                <code className="text-purple-300 text-sm bg-slate-800 px-2 py-0.5 rounded">{MOCK_CREDENTIALS.password}</code>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3 border-purple-700 text-purple-300 hover:bg-purple-900/50 hover:text-purple-200 text-xs"
              onClick={() => {
                setEmail(MOCK_CREDENTIALS.email);
                setPassword(MOCK_CREDENTIALS.password);
              }}
            >
              Auto-fill credentials
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

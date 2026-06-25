"use client";

import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const { error } = await authClient.requestPasswordReset({
        email: email.trim(),
        redirectTo: window.location.origin + "/reset-password",
      });

      if (error) {
        toast.error(error.message || "Failed to process request");
      } else {
        setSubmitted(true);
        toast.success("Reset email sent successfully!");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]"></div>

        <div className="max-w-md w-full glass-card p-10 rounded-2xl text-center shadow-2xl relative z-10">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">Check your email</h1>
          <p className="text-muted-foreground text-sm font-medium mb-8 leading-relaxed">
            We&apos;ve sent password reset instructions to <strong className="text-foreground">{email}</strong>.
          </p>
          <Link
            href="/login"
            className="inline-block bg-primary text-white py-3 px-8 rounded-full font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]"></div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.08] dark:opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      ></div>

      <div className="max-w-md w-full glass-card p-10 rounded-2xl shadow-2xl relative z-10">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Login
        </Link>

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
            Reset Password
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>
        </header>

        <form onSubmit={handleForgotPassword} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-xl bg-muted border border-border focus:border-primary focus:bg-accent focus:outline-none transition-all duration-300 text-foreground placeholder:text-muted-foreground/50"
              placeholder="name@example.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? "Sending link..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}

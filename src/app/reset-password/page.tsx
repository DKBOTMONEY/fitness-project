"use client";

import React, { useState, useEffect, Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, KeyRound, Check } from "lucide-react";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [validations, setValidations] = useState({
    upper: false,
    lower: false,
    length: false,
  });

  useEffect(() => {
    setValidations({
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      length: password.length >= 8,
    });
  }, [password]);

  const isPasswordValid = validations.upper && validations.lower && validations.length;

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return;
    if (!token) {
      toast.error("Invalid or missing password reset token");
      return;
    }

    setLoading(true);
    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token: token,
      });

      if (error) {
        toast.error(error.message || "Failed to reset password");
      } else {
        setSuccess(true);
        toast.success("Password updated successfully!");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="max-w-md w-full glass-card p-10 rounded-2xl text-center shadow-2xl relative z-10">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <KeyRound className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-4">Invalid Link</h1>
        <p className="text-muted-foreground text-sm font-medium mb-8 leading-relaxed">
          The password reset token is missing or invalid. Please request a new password reset link.
        </p>
        <Link 
          href="/forgot-password" 
          className="inline-block bg-primary text-white py-3 px-8 rounded-full font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          Request New Link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-md w-full glass-card p-10 rounded-2xl text-center shadow-2xl relative z-10 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-4">Password Updated</h1>
        <p className="text-muted-foreground text-sm font-medium mb-8 leading-relaxed">
          Your password has been successfully reset. You will be redirected to the login page in a few seconds.
        </p>
        <Link 
          href="/login" 
          className="inline-block bg-primary text-white py-3 px-8 rounded-full font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          Go to Login Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full glass-card p-10 rounded-2xl shadow-2xl relative z-10">
      <header className="mb-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
          <KeyRound size={24} />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
          New Password
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          Create a strong password for your Hundee account.
        </p>
      </header>

      <form onSubmit={handleResetPassword} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-xl bg-muted border border-border focus:border-primary focus:bg-accent focus:outline-none transition-all duration-300 text-foreground placeholder:text-muted-foreground/50"
            placeholder="min. 8 characters"
            required
            autoFocus
          />
          
          {/* Password Validation UI */}
          <div className="grid grid-cols-1 gap-2 mt-2 ml-1">
            <div className={`flex items-center gap-2 text-xs ${validations.length ? "text-green-500 dark:text-green-400" : "text-muted-foreground"}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${validations.length ? "bg-green-500 dark:bg-green-400" : "bg-muted-foreground/40"}`}></div>
              At least 8 characters
            </div>
            <div className={`flex items-center gap-2 text-xs ${validations.upper ? "text-green-500 dark:text-green-400" : "text-muted-foreground"}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${validations.upper ? "bg-green-500 dark:bg-green-400" : "bg-muted-foreground/40"}`}></div>
              At least one uppercase letter (A-Z)
            </div>
            <div className={`flex items-center gap-2 text-xs ${validations.lower ? "text-green-500 dark:text-green-400" : "text-muted-foreground"}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${validations.lower ? "bg-green-500 dark:bg-green-400" : "bg-muted-foreground/40"}`}></div>
              At least one lowercase letter (a-z)
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !isPasswordValid}
          className="w-full bg-primary text-white py-4 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          {loading ? "Updating password..." : "Confirm New Password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]"></div>
      
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

      <Suspense fallback={
        <div className="max-w-md w-full glass-card p-10 rounded-2xl text-center shadow-2xl relative z-10">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground text-sm font-medium mt-4">Loading reset form...</p>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}

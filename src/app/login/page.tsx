"use client";

import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUnverified, setIsUnverified] = useState(false);
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setIsUnverified(false);

    await authClient.signIn.email({
      email,
      password,
      callbackURL: "/dashboard",
    }, {
      onSuccess: () => {
        router.push("/dashboard");
      },
      onError: (ctx) => {
        if (ctx.error.status === 403 || ctx.error.message?.toLowerCase().includes("verify")) {
          setIsUnverified(true);
          setError("Your email is not verified. Please check your inbox.");
        } else {
          setError(ctx.error.message || "Failed to sign in");
        }
      }
    });
    setLoading(false);
  };

  const handleResendVerification = async () => {
    setLoading(true);
     
    await (authClient as any).emailVerification.sendVerificationEmail({
      email,
      callbackURL: "/dashboard",
    }, {
      onSuccess: () => {
        setError("Verification email resent! Check your inbox.");
        setIsUnverified(true);
      },
       
      onError: (ctx: any) => {
        setError(ctx.error.message || "Failed to resend verification email");
      }
    });
    setLoading(false);
  };

  const handleSocialLogin = async (provider: "google" | "line") => {
    await authClient.signIn.social({
      provider,
      callbackURL: "/dashboard",
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
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
        <header className="text-center mb-10">
          <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Enter your details to continue your journey.
          </p>
        </header>

        <div className="space-y-4 mb-8">
          <button
            onClick={() => handleSocialLogin("google")}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-muted border border-border rounded-xl font-medium text-foreground text-sm hover:bg-accent transition-all duration-300"
          >
            <Image src="https://www.google.com/favicon.ico" width={20} height={20} className="w-5 h-5" alt="Google" unoptimized />
            Continue with Google
          </button>
          <button
            onClick={() => handleSocialLogin("line")}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-[#00B900]/80 text-white rounded-xl font-medium text-sm hover:bg-[#00B900] transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.122.301.079.764.038 1.07l-.164.991c-.053.32-.249 1.258 1.103.688 1.352-.57 7.305-4.304 9.873-7.256 1.378-1.579 2.057-3.418 2.057-5.693z" />
            </svg>
            Continue with LINE
          </button>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-[10px] font-bold tracking-widest uppercase">
            <span className="bg-card px-3 py-1 rounded-full border border-border text-muted-foreground">
              Or Authentication
            </span>
          </div>
        </div>

        {error && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2 ${isUnverified ? "bg-primary/10 text-primary border border-primary/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
            {error}
            {isUnverified && (
              <button 
                onClick={handleResendVerification}
                className="block mt-2 font-bold underline hover:no-underline"
              >
                Resend verification email
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-6">
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
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-xl bg-muted border border-border focus:border-primary focus:bg-accent focus:outline-none transition-all duration-300 text-foreground placeholder:text-muted-foreground/50"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? "Signing in..." : "Sign In to Hundee"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-muted-foreground">
          New to Hundee?{" "}
          <Link href="/signup" className="text-primary font-bold hover:text-primary/80 transition-colors">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );

}
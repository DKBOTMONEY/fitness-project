"use client";

import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return;

    setLoading(true);
    await authClient.signUp.email({
      email,
      password,
      name,
      callbackURL: "/dashboard",
    }, {
      onSuccess: () => {
        setSuccess(true);
      },
      onError: (ctx) => {
        toast.error(ctx.error.message || "Failed to create account");
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

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-md w-full glass-card p-10 rounded-2xl text-center">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">Check your email</h1>
          <p className="text-muted-foreground mb-8">
            We&apos;ve sent a verification link to <strong className="text-foreground">{email}</strong>. Please click the link to verify your account.
          </p>
          <Link 
            href="/login" 
            className="inline-block bg-primary text-white py-3 px-8 rounded-full font-bold text-sm hover:bg-primary/90 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full glass-card p-10 rounded-2xl shadow-2xl relative overflow-hidden group">
        {/* Decorative background element inside card */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500"></div>
        
        <header className="text-center mb-10 relative z-10">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Create Account
          </h1>
          <p className="text-muted-foreground text-sm">
            Join Hundee and start your transformation.
          </p>
        </header>

        <div className="space-y-4 mb-8 relative z-10">
          <button
            onClick={() => handleSocialLogin("google")}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-border rounded-full font-medium text-foreground text-sm hover:bg-accent transition-colors bg-muted"
          >
            <Image src="https://www.google.com/favicon.ico" width={20} height={20} className="w-5 h-5" alt="Google" unoptimized />
            Sign up with Google
          </button>
          <button
            onClick={() => handleSocialLogin("line")}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#00B900] text-white rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.122.301.079.764.038 1.07l-.164.991c-.053.32-.249 1.258 1.103.688 1.352-.57 7.305-4.304 9.873-7.256 1.378-1.579 2.057-3.418 2.057-5.693z" />
            </svg>
            Sign up with LINE
          </button>
        </div>

        <div className="relative mb-8 z-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-4 text-muted-foreground backdrop-blur-sm border border-border rounded-full py-1">
              Or use your email
            </span>
          </div>
        </div>

        <form onSubmit={handleSignup} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 rounded-xl bg-muted border border-border focus:border-primary focus:outline-none transition-all text-foreground placeholder:text-muted-foreground/50"
              placeholder="John Doe"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-xl bg-muted border border-border focus:border-primary focus:outline-none transition-all text-foreground placeholder:text-muted-foreground/50"
              placeholder="name@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-xl bg-muted border border-border focus:border-primary focus:outline-none transition-all text-foreground placeholder:text-muted-foreground/50"
              placeholder="min. 8 characters"
              required
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
            className="w-full bg-primary text-white py-4 rounded-full font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground relative z-10">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

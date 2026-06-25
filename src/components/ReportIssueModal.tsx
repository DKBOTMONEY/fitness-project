"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { reportIssue } from '@/app/dashboard/actions';
import { toast } from 'sonner';

interface ReportIssueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportIssueModal({ open, onOpenChange }: ReportIssueModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
      const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';

      const res = await reportIssue({
        title,
        description,
        pageUrl,
        userAgent
      });

      if (res.success) {
        toast.success("Thank you! Your bug report has been submitted.");
        setTitle('');
        setDescription('');
        onOpenChange(false);
      } else {
        toast.error(res.error || "Failed to submit report. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card max-w-md border-border bg-card/60 backdrop-blur-2xl text-foreground rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
        
        <DialogHeader className="space-y-3 relative z-10">
          <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mb-2 mx-auto sm:mx-0 shadow-lg shadow-primary/5">
            <AlertTriangle className="text-primary animate-pulse" size={24} aria-hidden="true" />
          </div>
          <DialogTitle className="text-2xl font-black tracking-tight bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent uppercase italic">
            Report an Issue
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm font-medium">
            Found a bug or have feedback? Let us know so we can fix it. We will automatically capture your current page and browser info.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 relative z-10">
          <div className="space-y-1.5">
            <Label htmlFor="issue-title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              What&apos;s the issue? <span className="text-primary">*</span>
            </Label>
            <Input
              id="issue-title"
              name="title"
              placeholder="e.g., Calorie counter doesn't update, page froze…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-muted/40 border-border text-foreground placeholder-muted-foreground/50 rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all font-semibold"
              required
              autoComplete="off"
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="issue-desc" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Details <span className="text-primary">*</span>
            </Label>
            <Textarea
              id="issue-desc"
              name="description"
              placeholder="Please describe what happened, steps to reproduce, or any useful info…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] bg-muted/40 border-border text-foreground placeholder-muted-foreground/50 rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all font-medium resize-none"
              required
              disabled={loading}
            />
          </div>

          <DialogFooter className="pt-2 sm:gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border border-border text-muted-foreground hover:text-foreground font-bold uppercase tracking-wider text-xs cursor-pointer hover:bg-muted/50"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/95 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={14} aria-hidden="true" />
                  Submitting…
                </>
              ) : (
                'Submit Report'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

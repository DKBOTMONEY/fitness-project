"use client";

import React from "react";
import { WorkoutGenerator } from "@/components/WorkoutGenerator";

export default function WorkoutsPage() {
  return (
    <div className="flex flex-col h-full gap-8">
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Workouts</h1>
        <p className="text-muted-foreground font-medium text-sm mt-1">
          Plan, generate, and track your daily training protocols.
        </p>
      </header>

      {/* 
        We reuse the WorkoutGenerator component which perfectly matches 
        the aesthetic for this page. 
      */}
      <div className="flex-1 w-full">
        <WorkoutGenerator className="h-full border-border shadow-sm rounded-2xl" />
      </div>
    </div>
  );
}
"use client";

import React from 'react';
import { DashboardOverview } from '@/components/DashboardOverview';
import { SubscriptionCard } from '@/components/SubscriptionCard';

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
      <DashboardOverview className="col-span-1 md:col-span-2 xl:col-span-3" />
      <SubscriptionCard className="col-span-1 md:col-span-1 xl:col-span-1" />
    </div>
  );
}

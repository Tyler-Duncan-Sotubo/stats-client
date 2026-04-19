"use client";

import Link from "next/link";
import { AdminStatsCards } from "./admin-stats-cards";
import { NeedsReviewList } from "./needs-review-list";
import { Card, CardContent } from "@/shared/ui/card";

export function AdminDashboard() {
  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Catalog overview and data quality
        </p>
      </div>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Live counts
        </h2>
        <AdminStatsCards />
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Needs review
        </h2>
        <Card>
          <CardContent className="pt-4 pb-2">
            <NeedsReviewList />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

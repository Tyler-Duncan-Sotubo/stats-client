"use client";

import { useAdminStats } from "../hooks/use-admin-stats";
import { Card, CardContent } from "@/shared/ui/card";
import {
  Music,
  Disc3,
  Library,
  Award,
  Trophy,
  Star,
  AlertCircle,
} from "lucide-react";
import { Skeleton } from "@/shared/ui/skeleton";

const statConfig = [
  { key: "totalArtists", label: "Artists", icon: <Music size={16} />, highlight: false },
  { key: "totalSongs", label: "Songs", icon: <Disc3 size={16} />, highlight: false },
  { key: "totalAlbums", label: "Albums", icon: <Library size={16} />, highlight: false },
  {
    key: "totalCertifications",
    label: "Certifications",
    icon: <Award size={16} />,
    highlight: false,
  },
  { key: "totalAwards", label: "Awards", icon: <Trophy size={16} />, highlight: false },
  { key: "totalRecords", label: "Records", icon: <Star size={16} />, highlight: false },
  {
    key: "needsReview",
    label: "Needs Review",
    icon: <AlertCircle size={16} />,
    highlight: true,
  },
] as const;

export function AdminStatsCards() {
  const { stats, loading } = useAdminStats();

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-5 pb-5 space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-7 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statConfig.map(({ key, label, icon, highlight }) => (
        <Card
          key={key}
          className={
            highlight && stats?.needsReview
              ? "border-destructive/40 bg-destructive/5"
              : ""
          }
        >
          <CardContent className="pt-5 pb-5">
            <div
              className={`flex items-center gap-1.5 text-xs mb-2 ${
                highlight && stats?.needsReview
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
            >
              {icon}
              {label}
            </div>
            <p className="text-2xl font-bold">
              {stats ? (stats[key] ?? 0).toLocaleString() : "—"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

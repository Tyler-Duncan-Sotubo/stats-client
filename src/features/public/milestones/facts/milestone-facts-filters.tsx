"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";

interface Props {
  currentIsAfrobeats?: boolean;
  currentMetric?: string;
}

export function MilestoneFactsFilters({
  currentIsAfrobeats,
  currentMetric,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (value !== undefined) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  const afrobeatsValue =
    currentIsAfrobeats === true
      ? "afrobeats"
      : currentIsAfrobeats === false
        ? "global"
        : "all";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
      {/* Genre */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground font-medium w-14 shrink-0">
          Genre
        </span>
        <Tabs
          value={afrobeatsValue}
          onValueChange={(val) => {
            if (val === "afrobeats") updateParam("isAfrobeats", "true");
            else if (val === "global") updateParam("isAfrobeats", "false");
            else updateParam("isAfrobeats", undefined);
          }}
        >
          <TabsList className="bg-transparent gap-2 p-0 h-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="afrobeats">Afrobeats</TabsTrigger>
            <TabsTrigger value="global">Global</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Divider — desktop only */}
      <div className="hidden sm:block w-px h-5 bg-border shrink-0" />

      {/* Type */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground font-medium w-14 shrink-0">
          Type
        </span>
        <Tabs
          value={currentMetric ?? "all"}
          onValueChange={(val) =>
            updateParam("metric", val === "all" ? undefined : val)
          }
        >
          <TabsList className="bg-transparent gap-2 p-0 h-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="spotify_streams">Streams</TabsTrigger>
            <TabsTrigger value="monthly_listeners">Listeners</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}

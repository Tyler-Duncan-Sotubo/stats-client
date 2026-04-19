"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { BarChart2, Headphones, Music } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";

const TABS = [
  {
    value: "streams",
    label: "Most Streamed",
    icon: BarChart2,
  },
  {
    value: "listeners",
    label: "Most Listeners",
    icon: Headphones,
  },
  {
    value: "songs",
    label: "Top Songs",
    icon: Music,
  },
];

export function LeaderboardTabs({ currentTab }: { currentTab: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setTab(tab: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    params.delete("page");
    params.delete("country");
    if (tab === "songs") params.delete("country");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <Tabs value={currentTab} onValueChange={setTab}>
      <TabsList className="bg-transparent gap-2 p-0 h-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
              <Icon className="w-4 h-4" />
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}

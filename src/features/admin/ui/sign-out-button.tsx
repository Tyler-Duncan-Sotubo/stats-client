"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/shared/ui/button";

export function SignOutButton() {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0"
    >
      <LogOut size={15} />
    </Button>
  );
}

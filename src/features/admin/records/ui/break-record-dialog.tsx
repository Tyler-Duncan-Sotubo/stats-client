"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { ShieldAlert } from "lucide-react";
import { useBreakRecord } from "../hooks/use-break-record";
import {
  breakRecordSchema,
  type BreakRecordSchema,
} from "../schema/record.schema";

interface BreakRecordDialogProps {
  recordId: string;
  recordValue: string;
  onSuccess: () => void;
}

export function BreakRecordDialog({
  recordId,
  recordValue,
  onSuccess,
}: BreakRecordDialogProps) {
  const [open, setOpen] = useState(false);
  const { breakRecord, loading, error } = useBreakRecord(recordId, () => {
    setOpen(false);
    onSuccess();
  });

  const form = useForm<BreakRecordSchema>({
    resolver: zodResolver(breakRecordSchema),
    defaultValues: { brokenOn: "", notes: "" },
  });

  async function onSubmit(data: BreakRecordSchema) {
    await breakRecord(data);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10"
        >
          <ShieldAlert size={14} /> Mark broken
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mark record as broken</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">"{recordValue}"</p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="brokenOn">Broken on *</Label>
            <Input id="brokenOn" type="date" {...form.register("brokenOn")} />
            {form.formState.errors.brokenOn && (
              <p className="text-xs text-destructive">
                {form.formState.errors.brokenOn.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...form.register("notes")}
              placeholder="Who broke it and how..."
              rows={3}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={loading}>
              {loading ? "Saving..." : "Confirm"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

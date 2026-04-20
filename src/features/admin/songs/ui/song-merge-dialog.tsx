"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Button } from "@/shared/ui/button";
import { GitMerge, ChevronsUpDown, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMergeSong } from "../hooks/use-merge-song";
import { useSongs } from "../hooks/use-songs";
import { mergeSongSchema, type MergeSongSchema } from "../schema/song.schema";

interface SongMergeDialogProps {
  songId: string;
  songTitle: string;
}

export function SongMergeDialog({ songId, songTitle }: SongMergeDialogProps) {
  const [open, setOpen] = useState(false);
  const [comboOpen, setComboOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { mergeSong, loading, error } = useMergeSong(songId);
  const { data, loading: songsLoading, updateQuery } = useSongs({ limit: 20 });

  useEffect(() => {
    updateQuery({ search: search || undefined });
  }, [search]);

  const options = (data?.data ?? []).filter((s) => s.id !== songId);

  const form = useForm<MergeSongSchema>({
    resolver: zodResolver(mergeSongSchema),
    defaultValues: { targetSongId: "" },
  });

  const selectedId = form.watch("targetSongId");
  const selectedTitle = options.find((s) => s.id === selectedId)?.title;

  async function onSubmit(values: MergeSongSchema) {
    await mergeSong(values.targetSongId);
    setOpen(false);
    form.reset();
  }

  function handleOpenChange(v: boolean) {
    setOpen(v);
    if (!v) {
      form.reset();
      setSearch("");
      updateQuery({ search: undefined });
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <GitMerge size={14} /> Merge into
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Merge "{songTitle}"</DialogTitle>
        </DialogHeader>

        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <p>
            This song will be marked as <strong>merged</strong> and all future
            references will point to the target. Difficult to undo.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Merge into</label>
            <Controller
              name="targetSongId"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <Popover open={comboOpen} onOpenChange={setComboOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {selectedTitle ?? "Select target song..."}
                        <ChevronsUpDown
                          size={14}
                          className="ml-2 shrink-0 opacity-50"
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-100 p-0" align="start">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Search songs..."
                          value={search}
                          onValueChange={setSearch}
                        />
                        <CommandList>
                          {songsLoading ? (
                            <div className="py-4 text-center text-sm text-muted-foreground">
                              Searching...
                            </div>
                          ) : options.length === 0 ? (
                            <CommandEmpty>No songs found</CommandEmpty>
                          ) : (
                            <CommandGroup heading={`${options.length} songs`}>
                              {options.map((song) => (
                                <CommandItem
                                  key={song.id}
                                  value={song.id}
                                  onSelect={() => {
                                    field.onChange(song.id);
                                    setComboOpen(false);
                                  }}
                                >
                                  <Check
                                    size={14}
                                    className={cn(
                                      "mr-2 shrink-0",
                                      field.value === song.id
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium truncate">
                                      {song.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {song.slug}
                                    </p>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {fieldState.error && (
                    <p className="text-xs text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {selectedTitle && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 text-sm">
              <div className="text-center min-w-0 flex-1">
                <p className="font-medium truncate">{songTitle}</p>
                <p className="text-xs text-muted-foreground">will be merged</p>
              </div>
              <GitMerge size={16} className="shrink-0 text-muted-foreground" />
              <div className="text-center min-w-0 flex-1">
                <p className="font-medium truncate">{selectedTitle}</p>
                <p className="text-xs text-muted-foreground">target song</p>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-2 justify-end pt-1">
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={loading || !selectedId}
            >
              {loading ? "Merging..." : "Confirm merge"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

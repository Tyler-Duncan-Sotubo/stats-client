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
import { Badge } from "@/shared/ui/badge";
import { GitMerge, ChevronsUpDown, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMergeArtist } from "../hooks/use-merge-artist";
import { useArtists } from "../hooks/use-artists";
import {
  mergeArtistSchema,
  type MergeArtistSchema,
} from "../schema/artist.schema";

interface ArtistMergeDialogProps {
  artistId: string;
  artistName: string;
}

export function ArtistMergeDialog({
  artistId,
  artistName,
}: ArtistMergeDialogProps) {
  const [open, setOpen] = useState(false);
  const [comboOpen, setComboOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { mergeArtist, loading, error } = useMergeArtist(artistId);

  // ── Key fix: use updateQuery to reactively update search ─────────────────
  const {
    data,
    loading: artistsLoading,
    updateQuery,
  } = useArtists({
    limit: 20,
  });

  // Update the query whenever search changes
  useEffect(() => {
    updateQuery({ search: search || undefined });
  }, [search]);

  const options = (data?.data ?? []).filter((a) => a.id !== artistId);

  const form = useForm<MergeArtistSchema>({
    resolver: zodResolver(mergeArtistSchema),
    defaultValues: { targetArtistId: "" },
  });

  const selectedId = form.watch("targetArtistId");
  const selectedName =
    options.find((a) => a.id === selectedId)?.name ??
    data?.data.find((a) => a.id === selectedId)?.name;

  async function onSubmit(values: MergeArtistSchema) {
    await mergeArtist(values.targetArtistId);
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
          <DialogTitle>Merge "{artistName}"</DialogTitle>
        </DialogHeader>

        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <p>
            This artist will be marked as <strong>merged</strong> and all future
            references will point to the target. This is difficult to undo.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Merge into</label>

            <Controller
              name="targetArtistId"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <Popover open={comboOpen} onOpenChange={setComboOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={comboOpen}
                        className={cn(
                          "w-full justify-between font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {selectedName ?? "Select target artist..."}
                        <ChevronsUpDown
                          size={14}
                          className="ml-2 shrink-0 opacity-50"
                        />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-100 p-0" align="start">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Search artists..."
                          value={search}
                          onValueChange={(v) => setSearch(v)}
                        />
                        <CommandList>
                          {artistsLoading ? (
                            <div className="py-4 text-center text-sm text-muted-foreground">
                              Searching...
                            </div>
                          ) : options.length === 0 ? (
                            <CommandEmpty>
                              {search
                                ? `No artists matching "${search}"`
                                : "Type to search artists"}
                            </CommandEmpty>
                          ) : (
                            <CommandGroup heading={`${options.length} artists`}>
                              {options.map((artist) => (
                                <CommandItem
                                  key={artist.id}
                                  value={artist.id}
                                  onSelect={() => {
                                    field.onChange(artist.id);
                                    setComboOpen(false);
                                  }}
                                >
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <Check
                                      size={14}
                                      className={cn(
                                        "shrink-0 transition-opacity",
                                        field.value === artist.id
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    <div className="min-w-0 flex-1">
                                      <p className="text-sm font-medium truncate">
                                        {artist.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground truncate">
                                        {artist.originCountry ?? "Unknown"} ·{" "}
                                        {artist.entityStatus}
                                      </p>
                                    </div>
                                  </div>
                                  {artist.isAfrobeats && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs shrink-0"
                                    >
                                      Afrobeats
                                    </Badge>
                                  )}
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

          {/* Merge preview */}
          {selectedName && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 text-sm">
              <div className="text-center min-w-0 flex-1">
                <p className="font-medium truncate">{artistName}</p>
                <p className="text-xs text-muted-foreground">will be merged</p>
              </div>
              <GitMerge size={16} className="shrink-0 text-muted-foreground" />
              <div className="text-center min-w-0 flex-1">
                <p className="font-medium truncate">{selectedName}</p>
                <p className="text-xs text-muted-foreground">target artist</p>
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

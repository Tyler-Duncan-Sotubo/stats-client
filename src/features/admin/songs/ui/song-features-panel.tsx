"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/ui/button";
import { Trash2, Plus, Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";
import { cn } from "@/lib/utils";
import { useSongFeatures } from "../hooks/use-song-features";
import { useArtists } from "@/features/admin/artists/hooks/use-artists";
import {
  createSongFeatureSchema,
  type CreateSongFeatureSchema,
} from "../schema/song.schema";
import type { SongFeature } from "../types/song.types";

interface SongFeaturesPanelProps {
  songId: string;
  features: SongFeature[];
  onUpdate: () => void;
}

export function SongFeaturesPanel({
  songId,
  features,
  onUpdate,
}: SongFeaturesPanelProps) {
  const { addFeature, deleteFeature, loading } = useSongFeatures(
    songId,
    onUpdate,
  );
  const [adding, setAdding] = useState(false);
  const [comboOpen, setComboOpen] = useState(false);
  const [search, setSearch] = useState("");

  const {
    data,
    updateQuery,
    loading: artistsLoading,
  } = useArtists({ limit: 20 });

  useEffect(() => {
    updateQuery({ search: search || undefined });
  }, [search]);

  const form = useForm<CreateSongFeatureSchema>({
    resolver: zodResolver(createSongFeatureSchema),
    defaultValues: { featuredArtistId: "" },
  });

  const selectedId = form.watch("featuredArtistId");
  const selectedName = data?.data.find((a) => a.id === selectedId)?.name;

  async function onSubmit(data: CreateSongFeatureSchema) {
    await addFeature(data);
    form.reset();
    setAdding(false);
    setSearch("");
  }

  return (
    <div className="space-y-3">
      {features.length === 0 && (
        <p className="text-sm text-muted-foreground">No featured artists.</p>
      )}
      {features.map((feature) => (
        <div
          key={feature.id}
          className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/50"
        >
          <div>
            <p className="text-sm font-medium">{feature.artistName}</p>
            <p className="text-xs text-muted-foreground">
              {feature.artistSlug}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={() => deleteFeature(feature.featuredArtistId)}
            disabled={loading}
          >
            <Trash2 size={13} />
          </Button>
        </div>
      ))}

      {adding ? (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 pt-2">
          <Controller
            name="featuredArtistId"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-1">
                <Popover open={comboOpen} onOpenChange={setComboOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between font-normal h-8 text-sm",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {selectedName ?? "Search artist..."}
                      <ChevronsUpDown
                        size={13}
                        className="ml-2 opacity-50 shrink-0"
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[320px] p-0" align="start">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Search artists..."
                        value={search}
                        onValueChange={setSearch}
                      />
                      <CommandList>
                        {artistsLoading ? (
                          <div className="py-3 text-center text-sm text-muted-foreground">
                            Searching...
                          </div>
                        ) : (data?.data ?? []).length === 0 ? (
                          <CommandEmpty>No artists found</CommandEmpty>
                        ) : (
                          <CommandGroup>
                            {(data?.data ?? []).map((artist) => (
                              <CommandItem
                                key={artist.id}
                                value={artist.id}
                                onSelect={() => {
                                  field.onChange(artist.id);
                                  setComboOpen(false);
                                }}
                              >
                                <Check
                                  size={13}
                                  className={cn(
                                    "mr-2 shrink-0",
                                    field.value === artist.id
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                <div className="min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {artist.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {artist.originCountry ?? "Unknown"}
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
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={loading || !selectedId}>
              Add
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setAdding(false);
                setSearch("");
                form.reset();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => setAdding(true)}
        >
          <Plus size={13} /> Add featured artist
        </Button>
      )}
    </div>
  );
}

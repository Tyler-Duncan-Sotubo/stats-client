"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useArtists } from "@/features/admin/artists/hooks/use-artists";
import {
  createAlbumSchema,
  type CreateAlbumSchemaInput,
} from "../schema/album.schema";
import type { Album } from "../types/album.types";

interface AlbumFormProps {
  defaultValues?: Partial<Album>;
  onSubmit: (data: CreateAlbumSchemaInput) => Promise<void>;
  loading: boolean;
  error: string | null;
  submitLabel?: string;
}

export function AlbumForm({
  defaultValues,
  onSubmit,
  loading,
  error,
  submitLabel = "Save",
}: AlbumFormProps) {
  const [artistComboOpen, setArtistComboOpen] = useState(false);
  const [artistSearch, setArtistSearch] = useState("");

  const {
    data: artistData,
    loading: artistsLoading,
    updateQuery,
  } = useArtists({ limit: 20 });

  useEffect(() => {
    updateQuery({ search: artistSearch || undefined });
  }, [artistSearch]);

  const form = useForm<CreateAlbumSchemaInput>({
    resolver: zodResolver(createAlbumSchema),
    defaultValues: {
      artistId: defaultValues?.artistId ?? "",
      title: defaultValues?.title ?? "",
      spotifyAlbumId: defaultValues?.spotifyAlbumId ?? "",
      albumType: (defaultValues?.albumType as any) ?? "album",
      releaseDate: defaultValues?.releaseDate ?? "",
      imageUrl: defaultValues?.imageUrl ?? "",
      totalTracks: defaultValues?.totalTracks ?? undefined,
      isAfrobeats: defaultValues?.isAfrobeats ?? false,
    },
  });

  const selectedArtistId = form.watch("artistId");
  const selectedArtistName =
    artistData?.data.find((a) => a.id === selectedArtistId)?.name ??
    defaultValues?.artistName ??
    selectedArtistId;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Artist combobox */}
        <div className="space-y-1.5 md:col-span-2">
          <Label>Artist *</Label>
          <Controller
            name="artistId"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-1">
                <Popover
                  open={artistComboOpen}
                  onOpenChange={setArtistComboOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? selectedArtistName : "Select artist..."}
                      <ChevronsUpDown
                        size={14}
                        className="ml-2 shrink-0 opacity-50"
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Search artists..."
                        value={artistSearch}
                        onValueChange={setArtistSearch}
                      />
                      <CommandList className="max-h-60 overflow-y-auto">
                        {artistsLoading ? (
                          <div className="py-3 text-center text-sm text-muted-foreground">
                            Searching...
                          </div>
                        ) : (artistData?.data ?? []).length === 0 ? (
                          <CommandEmpty>No artists found</CommandEmpty>
                        ) : (
                          <CommandGroup>
                            {(artistData?.data ?? []).map((artist) => (
                              <CommandItem
                                key={artist.id}
                                value={artist.id}
                                onSelect={() => {
                                  field.onChange(artist.id);
                                  setArtistComboOpen(false);
                                }}
                              >
                                <Check
                                  size={14}
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
        </div>

        {/* Spotify album ID */}
        <div className="space-y-1.5">
          <Label htmlFor="spotifyAlbumId">Spotify album ID *</Label>
          <Input
            id="spotifyAlbumId"
            {...form.register("spotifyAlbumId")}
            placeholder="Spotify album ID"
          />
          {form.formState.errors.spotifyAlbumId && (
            <p className="text-xs text-destructive">
              {form.formState.errors.spotifyAlbumId.message}
            </p>
          )}
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            {...form.register("title")}
            placeholder="Album title"
          />
          {form.formState.errors.title && (
            <p className="text-xs text-destructive">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        {/* Album type */}
        <div className="space-y-1.5">
          <Label>Album type</Label>
          <Controller
            name="albumType"
            control={form.control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="album">Album</SelectItem>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="ep">EP</SelectItem>
                  <SelectItem value="compilation">Compilation</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Release date */}
        <div className="space-y-1.5">
          <Label htmlFor="releaseDate">Release date</Label>
          <Input
            id="releaseDate"
            type="date"
            {...form.register("releaseDate")}
          />
        </div>

        {/* Total tracks */}
        <div className="space-y-1.5">
          <Label htmlFor="totalTracks">Total tracks</Label>
          <Input
            id="totalTracks"
            type="number"
            {...form.register("totalTracks", { valueAsNumber: true })}
            placeholder="12"
          />
        </div>

        {/* Image URL */}
        <div className="space-y-1.5">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            {...form.register("imageUrl")}
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Afrobeats */}
      <Controller
        name="isAfrobeats"
        control={form.control}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              id="isAfrobeats"
            />
            <Label htmlFor="isAfrobeats">Is Afrobeats</Label>
          </div>
        )}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full md:w-auto">
        {loading ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}

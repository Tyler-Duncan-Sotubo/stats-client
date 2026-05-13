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
import { useAlbums } from "@/features/admin/albums/hooks/use-albums";
import {
  createSongSchema,
  type CreateSongSchemaInput,
} from "../schema/song.schema";
import type { Song } from "../types/song.types";

interface SongFormProps {
  defaultValues?: Partial<Song>;
  onSubmit: (data: CreateSongSchemaInput) => Promise<void>;
  loading: boolean;
  error: string | null;
  submitLabel?: string;
}

export function SongForm({
  defaultValues,
  onSubmit,
  loading,
  error,
  submitLabel = "Save",
}: SongFormProps) {
  const [artistComboOpen, setArtistComboOpen] = useState(false);
  const [artistSearch, setArtistSearch] = useState("");
  const [albumComboOpen, setAlbumComboOpen] = useState(false);
  const [albumSearch, setAlbumSearch] = useState("");

  const {
    data: artistData,
    loading: artistsLoading,
    updateQuery: updateArtistQuery,
  } = useArtists({ limit: 20 });

  const {
    data: albumData,
    loading: albumsLoading,
    updateQuery: updateAlbumQuery,
  } = useAlbums({ limit: 20 });

  useEffect(() => {
    updateArtistQuery({ search: artistSearch || undefined });
  }, [artistSearch]);

  useEffect(() => {
    updateAlbumQuery({ search: albumSearch || undefined });
  }, [albumSearch]);

  const form = useForm<CreateSongSchemaInput>({
    resolver: zodResolver(createSongSchema),
    defaultValues: {
      artistId: defaultValues?.artistId ?? "",
      albumId: defaultValues?.albumId ?? undefined,
      title: defaultValues?.title ?? "",
      spotifyTrackId: defaultValues?.spotifyTrackId ?? "",
      releaseDate: defaultValues?.releaseDate ?? "",
      durationMs: defaultValues?.durationMs ?? undefined,
      explicit: defaultValues?.explicit ?? false,
      isAfrobeats: defaultValues?.isAfrobeats ?? false,
      imageUrl: defaultValues?.imageUrl ?? "",
      tooxclusiveUrl: defaultValues?.tooxclusiveUrl ?? "",
      entityStatus: (defaultValues?.entityStatus as any) ?? "canonical",
      sourceOfTruth: (defaultValues?.sourceOfTruth as any) ?? undefined,
    },
  });

  const selectedArtistId = form.watch("artistId");
  const selectedAlbumId = form.watch("albumId");

  const selectedArtistName =
    artistData?.data.find((a) => a.id === selectedArtistId)?.name ??
    selectedArtistId;

  const selectedAlbumTitle =
    albumData?.data.find((a) => a.id === selectedAlbumId)?.title ??
    selectedAlbumId;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Artist combobox */}
        <div className="space-y-1.5">
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

        {/* Album combobox */}
        <div className="space-y-1.5">
          <Label>Album (optional)</Label>
          <Controller
            name="albumId"
            control={form.control}
            render={({ field }) => (
              <Popover open={albumComboOpen} onOpenChange={setAlbumComboOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between font-normal",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {field.value ? selectedAlbumTitle : "Select album..."}
                    <ChevronsUpDown
                      size={14}
                      className="ml-2 shrink-0 opacity-50"
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Search albums..."
                      value={albumSearch}
                      onValueChange={setAlbumSearch}
                    />
                    <CommandList className="max-h-60 overflow-y-auto">
                      {/* Clear selection */}
                      <CommandGroup>
                        <CommandItem
                          value="none"
                          onSelect={() => {
                            field.onChange(undefined);
                            setAlbumComboOpen(false);
                          }}
                        >
                          <Check
                            size={14}
                            className={cn(
                              "mr-2 shrink-0",
                              !field.value ? "opacity-100" : "opacity-0",
                            )}
                          />
                          <span className="text-muted-foreground text-sm">
                            No album
                          </span>
                        </CommandItem>
                      </CommandGroup>
                      {albumsLoading ? (
                        <div className="py-3 text-center text-sm text-muted-foreground">
                          Searching...
                        </div>
                      ) : (albumData?.data ?? []).length === 0 ? (
                        <CommandEmpty>No albums found</CommandEmpty>
                      ) : (
                        <CommandGroup>
                          {(albumData?.data ?? []).map((album) => (
                            <CommandItem
                              key={album.id}
                              value={album.id}
                              onSelect={() => {
                                field.onChange(album.id);
                                setAlbumComboOpen(false);
                              }}
                            >
                              <Check
                                size={14}
                                className={cn(
                                  "mr-2 shrink-0",
                                  field.value === album.id
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {album.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {album.artistName ?? "Unknown"} ·{" "}
                                  {album.albumType}
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
            )}
          />
        </div>

        {/* Title */}
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            {...form.register("title")}
            placeholder="Song title"
          />
          {form.formState.errors.title && (
            <p className="text-xs text-destructive">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        {/* Spotify track ID */}
        <div className="space-y-1.5">
          <Label htmlFor="spotifyTrackId">Spotify track ID</Label>
          <Input
            id="spotifyTrackId"
            {...form.register("spotifyTrackId")}
            placeholder="Spotify track ID"
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

        {/* Duration */}
        <div className="space-y-1.5">
          <Label htmlFor="durationMs">Duration (ms)</Label>
          <Input
            id="durationMs"
            type="number"
            {...form.register("durationMs", { valueAsNumber: true })}
            placeholder="210000"
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

        <div className="space-y-1.5">
          <Label htmlFor="tooxclusiveUrl">TooXclusive URL</Label>
          <Input
            id="tooxclusiveUrl"
            {...form.register("tooxclusiveUrl")}
            placeholder="https://tooxclusive.com/..."
          />
        </div>

        {/* Entity status */}
        <div className="space-y-1.5">
          <Label>Entity status</Label>
          <Controller
            name="entityStatus"
            control={form.control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="canonical">Canonical</SelectItem>
                  <SelectItem value="provisional">Provisional</SelectItem>
                  <SelectItem value="merged">Merged</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Source of truth */}
        <div className="space-y-1.5">
          <Label>Source of truth</Label>
          <Controller
            name="sourceOfTruth"
            control={form.control}
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spotify">Spotify</SelectItem>
                  <SelectItem value="kworb">Kworb</SelectItem>
                  <SelectItem value="billboard">Billboard</SelectItem>
                  <SelectItem value="official_charts">
                    Official Charts
                  </SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-6">
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
        <Controller
          name="explicit"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                id="explicit"
              />
              <Label htmlFor="explicit">Explicit</Label>
            </div>
          )}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full md:w-auto">
        {loading ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}

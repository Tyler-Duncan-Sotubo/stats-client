"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
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
  createCertificationSchema,
  type CreateCertificationSchemaInput,
} from "../schema/certification.schema";
import type { Certification } from "../types/certification.types";

interface CertificationFormProps {
  defaultValues?: Partial<Certification>;
  onSubmit: (data: CreateCertificationSchemaInput) => Promise<void>;
  loading: boolean;
  error: string | null;
  submitLabel?: string;
}

export function CertificationForm({
  defaultValues,
  onSubmit,
  loading,
  error,
  submitLabel = "Save",
}: CertificationFormProps) {
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

  const form = useForm<CreateCertificationSchemaInput>({
    resolver: zodResolver(createCertificationSchema),
    defaultValues: {
      artistId: defaultValues?.artistId ?? undefined,
      songId: defaultValues?.songId ?? undefined,
      albumId: defaultValues?.albumId ?? undefined,
      territory: defaultValues?.territory ?? "",
      body: defaultValues?.body ?? "",
      title: defaultValues?.title ?? "",
      level: (defaultValues?.level as any) ?? undefined,
      units: defaultValues?.units ?? undefined,
      certifiedAt: defaultValues?.certifiedAt ?? "",
      sourceUrl: defaultValues?.sourceUrl ?? "",
      rawArtistName: defaultValues?.rawArtistName ?? "",
      rawTitle: defaultValues?.rawTitle ?? "",
      resolutionStatus: (defaultValues?.resolutionStatus as any) ?? "matched",
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
          <Label>Artist</Label>
          <Controller
            name="artistId"
            control={form.control}
            render={({ field }) => (
              <Popover open={artistComboOpen} onOpenChange={setArtistComboOpen}>
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
                      <CommandGroup>
                        <CommandItem
                          value="none"
                          onSelect={() => {
                            field.onChange(undefined);
                            setArtistComboOpen(false);
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
                            No artist
                          </span>
                        </CommandItem>
                      </CommandGroup>
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
            )}
          />
        </div>

        {/* Title */}
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            {...form.register("title")}
            placeholder="Song or album title"
          />
          {form.formState.errors.title && (
            <p className="text-xs text-destructive">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        {/* Level */}
        <div className="space-y-1.5">
          <Label>Level *</Label>
          <Controller
            name="level"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-1">
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diamond">Diamond</SelectItem>
                    <SelectItem value="platinum">Platinum</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <p className="text-xs text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* Units */}
        <div className="space-y-1.5">
          <Label htmlFor="units">Units</Label>
          <Input
            id="units"
            type="number"
            {...form.register("units", { valueAsNumber: true })}
            placeholder="1000000"
          />
        </div>

        {/* Territory */}
        <div className="space-y-1.5">
          <Label htmlFor="territory">Territory *</Label>
          <Input
            id="territory"
            {...form.register("territory")}
            placeholder="US"
          />
          {form.formState.errors.territory && (
            <p className="text-xs text-destructive">
              {form.formState.errors.territory.message}
            </p>
          )}
        </div>

        {/* Body */}
        <div className="space-y-1.5">
          <Label htmlFor="body">Body *</Label>
          <Input id="body" {...form.register("body")} placeholder="RIAA" />
          {form.formState.errors.body && (
            <p className="text-xs text-destructive">
              {form.formState.errors.body.message}
            </p>
          )}
        </div>

        {/* Certified at */}
        <div className="space-y-1.5">
          <Label htmlFor="certifiedAt">Certified at</Label>
          <Input
            id="certifiedAt"
            type="date"
            {...form.register("certifiedAt")}
          />
        </div>

        {/* Resolution status */}
        <div className="space-y-1.5">
          <Label>Resolution status</Label>
          <Controller
            name="resolutionStatus"
            control={form.control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="matched">Matched</SelectItem>
                  <SelectItem value="artist_only">Artist only</SelectItem>
                  <SelectItem value="unresolved">Unresolved</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Source URL */}
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="sourceUrl">Source URL</Label>
          <Input
            id="sourceUrl"
            {...form.register("sourceUrl")}
            placeholder="https://www.riaa.com/..."
          />
        </div>

        {/* Raw fields */}
        <div className="space-y-1.5">
          <Label htmlFor="rawArtistName">Raw artist name</Label>
          <Input
            id="rawArtistName"
            {...form.register("rawArtistName")}
            placeholder="As scraped"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="rawTitle">Raw title</Label>
          <Input
            id="rawTitle"
            {...form.register("rawTitle")}
            placeholder="As scraped"
          />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full md:w-auto">
        {loading ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
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
  createAwardSchema,
  type CreateAwardSchemaInput,
} from "../schema/award.schema";
import type { Award } from "../types/award.types";

interface AwardFormProps {
  defaultValues?: Partial<Award>;
  onSubmit: (data: CreateAwardSchemaInput) => Promise<void>;
  loading: boolean;
  error: string | null;
  submitLabel?: string;
}

export function AwardForm({
  defaultValues,
  onSubmit,
  loading,
  error,
  submitLabel = "Save",
}: AwardFormProps) {
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

  const form = useForm<CreateAwardSchemaInput>({
    resolver: zodResolver(createAwardSchema),
    defaultValues: {
      artistId: defaultValues?.artistId ?? undefined,
      songId: defaultValues?.songId ?? undefined,
      albumId: defaultValues?.albumId ?? undefined,
      awardBody: defaultValues?.awardBody ?? "",
      awardName: defaultValues?.awardName ?? "",
      category: defaultValues?.category ?? "",
      result: (defaultValues?.result as any) ?? undefined,
      year: defaultValues?.year ?? new Date().getFullYear(),
      ceremony: defaultValues?.ceremony ?? "",
      territory: defaultValues?.territory ?? "",
      sourceUrl: defaultValues?.sourceUrl ?? "",
      notes: defaultValues?.notes ?? "",
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

        {/* Award body */}
        <div className="space-y-1.5">
          <Label htmlFor="awardBody">Award body *</Label>
          <Input
            id="awardBody"
            {...form.register("awardBody")}
            placeholder="Grammy, MOBO, BET..."
          />
          {form.formState.errors.awardBody && (
            <p className="text-xs text-destructive">
              {form.formState.errors.awardBody.message}
            </p>
          )}
        </div>

        {/* Award name */}
        <div className="space-y-1.5">
          <Label htmlFor="awardName">Award name *</Label>
          <Input
            id="awardName"
            {...form.register("awardName")}
            placeholder="Best African Artist..."
          />
          {form.formState.errors.awardName && (
            <p className="text-xs text-destructive">
              {form.formState.errors.awardName.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="category">Category *</Label>
          <Input
            id="category"
            {...form.register("category")}
            placeholder="Best Global Music Album..."
          />
          {form.formState.errors.category && (
            <p className="text-xs text-destructive">
              {form.formState.errors.category.message}
            </p>
          )}
        </div>

        {/* Result */}
        <div className="space-y-1.5">
          <Label>Result *</Label>
          <Controller
            name="result"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-1">
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select result" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="won">Won</SelectItem>
                    <SelectItem value="nominated">Nominated</SelectItem>
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

        {/* Year */}
        <div className="space-y-1.5">
          <Label htmlFor="year">Year *</Label>
          <Input
            id="year"
            type="number"
            {...form.register("year", { valueAsNumber: true })}
            placeholder="2024"
          />
          {form.formState.errors.year && (
            <p className="text-xs text-destructive">
              {form.formState.errors.year.message}
            </p>
          )}
        </div>

        {/* Ceremony */}
        <div className="space-y-1.5">
          <Label htmlFor="ceremony">Ceremony</Label>
          <Input
            id="ceremony"
            {...form.register("ceremony")}
            placeholder="66th Grammy Awards"
          />
        </div>

        {/* Territory */}
        <div className="space-y-1.5">
          <Label htmlFor="territory">Territory</Label>
          <Input
            id="territory"
            {...form.register("territory")}
            placeholder="US"
          />
        </div>

        {/* Source URL */}
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="sourceUrl">Source URL</Label>
          <Input
            id="sourceUrl"
            {...form.register("sourceUrl")}
            placeholder="https://..."
          />
        </div>

        {/* Notes */}
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            {...form.register("notes")}
            placeholder="Any additional notes..."
            rows={3}
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

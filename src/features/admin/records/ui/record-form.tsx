"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { Switch } from "@/shared/ui/switch";
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
  createRecordSchema,
  type CreateRecordSchemaInput,
} from "../schema/record.schema";
import type { Record } from "../types/record.types";

interface RecordFormProps {
  defaultValues?: Partial<Record>;
  onSubmit: (data: CreateRecordSchemaInput) => Promise<void>;
  loading: boolean;
  error: string | null;
  submitLabel?: string;
}

export function RecordForm({
  defaultValues,
  onSubmit,
  loading,
  error,
  submitLabel = "Save",
}: RecordFormProps) {
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

  const form = useForm<CreateRecordSchemaInput>({
    resolver: zodResolver(createRecordSchema),
    defaultValues: {
      artistId: defaultValues?.artistId ?? undefined,
      songId: defaultValues?.songId ?? undefined,
      albumId: defaultValues?.albumId ?? undefined,
      recordType: defaultValues?.recordType ?? "",
      recordValue: defaultValues?.recordValue ?? "",
      numericValue: defaultValues?.numericValue ?? undefined,
      scope: defaultValues?.scope ?? "",
      isActive: defaultValues?.isActive ?? true,
      setOn: defaultValues?.setOn ?? "",
      brokenOn: defaultValues?.brokenOn ?? "",
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

        {/* Record type */}
        <div className="space-y-1.5">
          <Label htmlFor="recordType">Record type *</Label>
          <Input
            id="recordType"
            {...form.register("recordType")}
            placeholder="first_billion_streams"
          />
          {form.formState.errors.recordType && (
            <p className="text-xs text-destructive">
              {form.formState.errors.recordType.message}
            </p>
          )}
        </div>

        {/* Scope */}
        <div className="space-y-1.5">
          <Label htmlFor="scope">Scope *</Label>
          <Input
            id="scope"
            {...form.register("scope")}
            placeholder="nigeria, global, africa..."
          />
          {form.formState.errors.scope && (
            <p className="text-xs text-destructive">
              {form.formState.errors.scope.message}
            </p>
          )}
        </div>

        {/* Record value */}
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="recordValue">Record value *</Label>
          <Input
            id="recordValue"
            {...form.register("recordValue")}
            placeholder="First Nigerian artist to surpass 1 billion Spotify streams"
          />
          {form.formState.errors.recordValue && (
            <p className="text-xs text-destructive">
              {form.formState.errors.recordValue.message}
            </p>
          )}
        </div>

        {/* Numeric value */}
        <div className="space-y-1.5">
          <Label htmlFor="numericValue">Numeric value</Label>
          <Input
            id="numericValue"
            type="number"
            {...form.register("numericValue", { valueAsNumber: true })}
            placeholder="1000000000"
          />
        </div>

        {/* Set on */}
        <div className="space-y-1.5">
          <Label htmlFor="setOn">Set on</Label>
          <Input id="setOn" type="date" {...form.register("setOn")} />
        </div>

        {/* Broken on */}
        <div className="space-y-1.5">
          <Label htmlFor="brokenOn">Broken on</Label>
          <Input id="brokenOn" type="date" {...form.register("brokenOn")} />
        </div>

        {/* Is active */}
        <div className="space-y-1.5 flex items-end">
          <Controller
            name="isActive"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="isActive"
                />
                <Label htmlFor="isActive">Active record</Label>
              </div>
            )}
          />
        </div>

        {/* Notes */}
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            {...form.register("notes")}
            placeholder="Additional context..."
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

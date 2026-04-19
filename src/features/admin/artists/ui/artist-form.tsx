"use client";

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
import { Switch } from "@/shared/ui/switch";
import {
  createArtistSchema,
  CreateArtistSchemaInput,
  type CreateArtistSchema,
} from "../schema/artist.schema";
import type { Artist } from "../types/artist.types";

interface ArtistFormProps {
  defaultValues?: Partial<Artist>;
  onSubmit: (data: CreateArtistSchemaInput) => Promise<void>;
  loading: boolean;
  error: string | null;
  submitLabel?: string;
}

export function ArtistForm({
  defaultValues,
  onSubmit,
  loading,
  error,
  submitLabel = "Save",
}: ArtistFormProps) {
  const form = useForm<CreateArtistSchemaInput>({
    resolver: zodResolver(createArtistSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      spotifyId: defaultValues?.spotifyId ?? "",
      originCountry: defaultValues?.originCountry ?? "",
      debutYear: defaultValues?.debutYear ?? undefined,
      imageUrl: defaultValues?.imageUrl ?? "",
      isAfrobeats: defaultValues?.isAfrobeats ?? false,
      isAfrobeatsOverride: defaultValues?.isAfrobeatsOverride ?? false,
      bio: defaultValues?.bio ?? "",
      entityStatus: (defaultValues?.entityStatus as any) ?? "canonical",
      sourceOfTruth: (defaultValues?.sourceOfTruth as any) ?? undefined,
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic info */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            {...form.register("name")}
            placeholder="Artist name"
          />
          {form.formState.errors.name && (
            <p className="text-xs text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="spotifyId">Spotify ID</Label>
          <Input
            id="spotifyId"
            {...form.register("spotifyId")}
            placeholder="4Z8W4fKeB5YxbusRsdQVPb"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="originCountry">Origin country</Label>
          <Input
            id="originCountry"
            {...form.register("originCountry")}
            placeholder="NG"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="debutYear">Debut year</Label>
          <Input
            id="debutYear"
            type="number"
            {...form.register("debutYear", { valueAsNumber: true })}
            placeholder="2010"
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            {...form.register("imageUrl")}
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Status */}
      <div className="grid md:grid-cols-2 gap-4">
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
          name="isAfrobeatsOverride"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                id="isAfrobeatsOverride"
              />
              <Label htmlFor="isAfrobeatsOverride">Afrobeats override</Label>
            </div>
          )}
        />
      </div>

      {/* Bio */}
      <div className="space-y-1.5">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          {...form.register("bio")}
          placeholder="Artist bio..."
          rows={4}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full md:w-auto">
        {loading ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}

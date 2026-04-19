"use client";

import Link from "next/link";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useRegister } from "../hooks/use-register";
import { registerSchema } from "../schema/register.schema";

export default function RegisterForm() {
  const { register, error } = useRegister();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "both",
      location: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    await register(values);
  }

  return (
    <section className="mx-auto w-full max-w-lg rounded-2xl bg-card p-10 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-[28px] font-extrabold text-foreground">
            Create account
          </h1>
          <p className="text-sm text-muted-foreground">
            Join Stats Engine today
          </p>
        </div>

        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-foreground"
                  >
                    Full Name
                  </FieldLabel>
                  <Input id="name" placeholder="John Doe" {...field} />
                  <FieldError
                    errors={fieldState.error ? [fieldState.error] : []}
                  />
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-foreground"
                  >
                    Email
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                  />
                  <FieldError
                    errors={fieldState.error ? [fieldState.error] : []}
                  />
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-foreground"
                  >
                    Password
                  </FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min. 8 characters"
                    {...field}
                  />
                  <FieldError
                    errors={fieldState.error ? [fieldState.error] : []}
                  />
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="location"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel
                    htmlFor="location"
                    className="mb-2 block text-sm font-semibold text-foreground"
                  >
                    Location (optional)
                  </FieldLabel>
                  <Input id="location" placeholder="Lagos" {...field} />
                  <FieldError
                    errors={fieldState.error ? [fieldState.error] : []}
                  />
                </FieldContent>
              </Field>
            )}
          />

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="mt-2 h-12 w-full rounded-[10px] text-[15px] font-bold"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Creating account..."
              : "Create Account"}
          </Button>
        </FieldGroup>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Log in
          </Link>
        </p>
      </form>
    </section>
  );
}

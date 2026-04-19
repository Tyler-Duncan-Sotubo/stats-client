"use client";

import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/shared/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { useForgotPassword } from "../hooks/use-forgot-password";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const { forgotPassword, error, success } = useForgotPassword();

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordSchema) {
    await forgotPassword(values.email);
  }

  return (
    <section className="mx-auto w-full max-w-lg rounded-2xl bg-card p-10 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-[28px] font-extrabold text-foreground">
            Forgot password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        {success ? (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-700">
            If that email exists, a reset link has been sent. Check your inbox.
          </div>
        ) : (
          <FieldGroup>
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
                      {...field}
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                    />
                    <FieldError
                      errors={fieldState.error ? [fieldState.error] : []}
                      className="mt-2"
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
              disabled={form.formState.isSubmitting}
              className="mt-2 h-12 w-full rounded-[10px] text-[15px] font-bold"
            >
              {form.formState.isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>
          </FieldGroup>
        )}

        <p className="text-center text-sm text-muted-foreground">
          Remembered it?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Back to login
          </Link>
        </p>
      </form>
    </section>
  );
}

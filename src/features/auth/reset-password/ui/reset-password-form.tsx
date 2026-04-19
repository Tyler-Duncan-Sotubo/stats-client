"use client";

import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { Button } from "@/shared/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { useResetPassword } from "../hooks/use-reset-password";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

type Props = {
  token: string;
};

export default function ResetPasswordForm({ token }: Props) {
  const { resetPassword, error, success } = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: ResetPasswordSchema) {
    await resetPassword(token, values.password);
  }

  return (
    <section className="mx-auto w-full max-w-lg rounded-2xl bg-card p-10 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-[28px] font-extrabold text-foreground">
            Reset password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your new password below.
          </p>
        </div>

        {success ? (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-700">
            Password reset successful! Redirecting you to login...
          </div>
        ) : (
          <FieldGroup>
            {/* New Password */}
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
                      New Password
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 8 characters"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <FiEyeOff size={18} />
                        ) : (
                          <FiEye size={18} />
                        )}
                      </button>
                    </div>
                    <FieldError
                      errors={fieldState.error ? [fieldState.error] : []}
                      className="mt-2"
                    />
                  </FieldContent>
                </Field>
              )}
            />

            {/* Confirm Password */}
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel
                      htmlFor="confirmPassword"
                      className="mb-2 block text-sm font-semibold text-foreground"
                    >
                      Confirm Password
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Repeat your new password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((prev) => !prev)}
                        className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                      >
                        {showConfirm ? (
                          <FiEyeOff size={18} />
                        ) : (
                          <FiEye size={18} />
                        )}
                      </button>
                    </div>
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
              {form.formState.isSubmitting ? "Resetting..." : "Reset Password"}
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

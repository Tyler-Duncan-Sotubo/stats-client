"use client";

import Link from "next/link";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { Button } from "@/shared/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";

import { loginSchema } from "../schema/login.schema";
import { useLogin } from "../hooks/use-login";

import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginForm() {
  const { login, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    await login(values.email, values.password);
  }

  return (
    <section className="mx-auto w-full max-w-lg rounded-2xl bg-card p-10 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-[28px] font-extrabold text-foreground">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Log in to your Stats Engine account
          </p>
        </div>

        <FieldGroup>
          {/* Email */}
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

          {/* Password with toggle */}
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
                  <div className="relative">
                    <Input
                      {...field}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
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

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="mt-2 h-12 w-full rounded-[10px] text-[15px] font-bold"
          >
            {form.formState.isSubmitting ? "Logging in..." : "Login"}
          </Button>

          {/* Forgot password */}
          <p className="text-center text-sm text-muted-foreground">
            <Link
              href="/forgot-password"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Forgot your password?
            </Link>
          </p>
        </FieldGroup>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </form>
    </section>
  );
}

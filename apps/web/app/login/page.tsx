'use client';

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, Lock, ShieldCheck, Sparkles } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const defaultValues: LoginFormValues = {
  email: "",
  password: "",
  rememberMe: false,
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  const isSubmitting = form.formState.isSubmitting;
  const nextPath = searchParams?.get("next") ?? "/dashboard";

  async function handleSubmit(values: LoginFormValues) {
    setServerError(null);

    try {
      const { data, error } = await authClient.signIn.email({
        email: values.email.trim().toLowerCase(),
        password: values.password,
        rememberMe: values.rememberMe,
        callbackURL: nextPath,
      });

      if (error) {
        const friendlyMessage =
          error.message ??
          (error.status === 401
            ? "The email or password you entered is incorrect."
            : "We couldn’t sign you in right now. Please try again in a moment.");
        setServerError(friendlyMessage);
        return;
      }

      if (data?.redirectTo) {
        router.push(data.redirectTo);
      } else {
        router.push(nextPath);
      }
    } catch {
      setServerError("Something went wrong while signing you in. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-2xl bg-background shadow-xl ring-1 ring-border md:grid-cols-[1.05fr_1fr]">
          <div className="relative flex flex-col justify-between bg-primary px-8 py-10 text-primary-foreground sm:px-12">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/70 opacity-90" />

            <div className="relative space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary-foreground/80">
                  <Lock className="h-4 w-4" />
                  Secure Sign-In
                </div>
                <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">Welcome back</h1>
                <p className="max-w-md text-sm text-primary-foreground/80 sm:text-base">
                  Access MedScan AI to review findings, collaborate with your care teams, and keep
                  diagnostic workflows moving—all with enterprise-grade security.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 rounded-xl bg-primary-foreground/5 p-4 backdrop-blur-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">Real-time intelligence</h3>
                    <p className="text-sm text-primary-foreground/75">
                      Receive instant triage for CT, MRI, and radiology studies with structured insights.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-xl bg-primary-foreground/5 p-4 backdrop-blur-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">Verified for clinical teams</h3>
                    <p className="text-sm text-primary-foreground/75">
                      HIPAA-aligned controls and audit trails tailored to hospital deployments.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-xl bg-primary-foreground/5 p-4 backdrop-blur-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">Assisted decision-making</h3>
                    <p className="text-sm text-primary-foreground/75">
                      Confidence scoring, annotated findings, and structured summaries for every scan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex items-center bg-background px-6 py-10 sm:px-10">
            <div className="w-full">
              <Card className="border-0 bg-transparent shadow-none">
                <CardHeader className="space-y-2 p-0">
                  <CardTitle className="text-2xl font-semibold tracking-tight">Sign in to MedScan AI</CardTitle>
                  <CardDescription>
                    Enter your credentials to continue to the diagnostic dashboard.
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-0 pt-6">
                  {serverError ? (
                    <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      {serverError}
                    </div>
                  ) : null}

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email address</FormLabel>
                            <FormControl>
                              <Input
                                autoComplete="email"
                                inputMode="email"
                                placeholder="you@hospital.org"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel>Password</FormLabel>
                              <Link
                                href="/reset-password"
                                className="text-sm font-medium text-primary hover:text-primary/80"
                              >
                                Forgot password?
                              </Link>
                            </div>
                            <FormControl>
                              <Input type="password" autoComplete="current-password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="rememberMe"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal text-muted-foreground">
                              Keep me signed in on this device
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Signing in…" : "Sign in"}
                      </Button>
                    </form>
                  </Form>

                  <p className="mt-6 text-center text-sm text-muted-foreground">
                    Need an account?{" "}
                    <Link href="/create-account" className="font-medium text-primary hover:text-primary/80">
                      Request secure access
                    </Link>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-muted" />}>
      <LoginForm />
    </Suspense>
  );
}

"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShieldCheck, Activity, BarChart3, Hospital, Lock } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

const createAccountSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    organization: z.string().min(1, "Organization or facility is required"),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
,
    confirmPassword: z.string().min(8, "Confirm your password"),
    receiveUpdates: z.boolean(),
    acceptTerms: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  })
  .refine((data) => data.acceptTerms, {
    path: ["acceptTerms"],
    message: "You must agree to the terms to continue",
  })

type CreateAccountFormValues = z.infer<typeof createAccountSchema>

const defaultValues: CreateAccountFormValues = {
  fullName: "",
  organization: "",
  email: "",
  password: "",
  confirmPassword: "",
  receiveUpdates: true,
  acceptTerms: false,
}

const benefits = [
  {
    title: "Secure Access",
    description: "HIPAA-aligned authentication with adaptive safeguards.",
    icon: ShieldCheck,
  },
  {
    title: "Instant Analysis",
    description: "Real-time triage for radiology, CT, and MRI workflows.",
    icon: Activity,
  },
  {
    title: "Actionable Reports",
    description: "Structured findings with confidence scoring and highlights.",
    icon: BarChart3,
  },
]

export default function CreateAccountPage() {
  const router = useRouter()
  const [serverError, setServerError] = React.useState<string | null>(null)
  const form = useForm<CreateAccountFormValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues,
  })

  const isSubmitting = form.formState.isSubmitting

  async function handleSubmit(values: CreateAccountFormValues) {
    setServerError(null)

    try {
      const { data, error } = await authClient.signUp.email({
        name: values.fullName.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        organization: values.organization.trim(),
        receiveUpdates: values.receiveUpdates,
      })

      if (error) {
        const friendlyMessage =
          error.message ??
          (error.status === 422
            ? "Please double-check the form details and try again."
            : "We couldn't complete your request right now. Please try again shortly.")
        setServerError(friendlyMessage)
        return
      }

      // Redirect to dashboard on success
      router.push("/dashboard")
    } catch {
      setServerError("Something went wrong while creating your account. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-2xl bg-background shadow-xl ring-1 ring-border md:grid-cols-[1.1fr_1fr]">
          <div className="relative flex flex-col justify-between bg-primary px-8 py-10 text-primary-foreground sm:px-12">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/70 opacity-90" />
            <div className="relative space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary-foreground/80">
                  <Lock className="h-4 w-4" />
                  Trusted Healthcare AI
                </div>
                <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                  MedScan AI
                </h1>
                <p className="max-w-md text-sm text-primary-foreground/80 sm:text-base">
                  Delivering secure, real-time diagnostic support for radiologists and clinical teams.
                  Onboard your organization in minutes and keep patient data protected end-to-end.
                </p>
              </div>

              <div className="space-y-6">
                {benefits.map((benefit) => (
                  <div
                    key={benefit.title}
                    className="flex items-start gap-4 rounded-xl bg-primary-foreground/5 p-4 backdrop-blur-sm"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10">
                      <benefit.icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">{benefit.title}</h3>
                      <p className="text-sm text-primary-foreground/75">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative pt-8">
              <div className="rounded-2xl bg-primary-foreground/10 p-6 backdrop-blur">
                <p className="text-sm font-medium uppercase tracking-wide text-primary-foreground/80">
                  Platform Snapshot
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-3xl font-semibold">3.2M+</p>
                    <p className="text-sm text-primary-foreground/70">Analyses completed</p>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold">97%</p>
                    <p className="text-sm text-primary-foreground/70">Detection accuracy</p>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold">250+</p>
                    <p className="text-sm text-primary-foreground/70">Hospitals onboarded</p>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold">&lt;90s</p>
                    <p className="text-sm text-primary-foreground/70">Average turnaround</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex items-center bg-background px-6 py-10 sm:px-10">
            <div className="w-full">
              <Card className="border-0 bg-transparent shadow-none">
                <CardHeader className="space-y-2 p-0">
                  <CardTitle className="text-2xl font-semibold tracking-tight">
                    Request secure access
                  </CardTitle>
                  <CardDescription>
                    Provide your credentials to activate your MedScan AI account.
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
                      <div className="grid gap-4">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Dr. Jane Doe"
                                  autoComplete="name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="organization"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Healthcare organization</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="MedScan Radiology Center"
                                  autoComplete="organization"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email address</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="you@hospital.org"
                                  autoComplete="email"
                                  inputMode="email"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid gap-4 sm:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input
                                    type="password"
                                    placeholder="Create a password"
                                    autoComplete="new-password"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm password</FormLabel>
                                <FormControl>
                                  <Input
                                    type="password"
                                    placeholder="Confirm password"
                                    autoComplete="new-password"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <FormField
                          control={form.control}
                          name="receiveUpdates"
                          render={({ field }) => (
                            <FormItem className="space-y-2 rounded-lg border border-border/80 bg-muted/40 px-4 py-3">
                              <div className="flex flex-row items-start gap-3">
                                <FormControl>
                                  <Checkbox
                                    id={field.name}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel htmlFor={field.name} className="text-sm font-medium">
                                    Keep me informed about product updates
                                  </FormLabel>
                                  <p className="text-xs text-muted-foreground">
                                    Receive alerts when new analysis models and features are released.
                                  </p>
                                </div>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="acceptTerms"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <div className="flex flex-row items-start gap-3">
                                <FormControl>
                                  <Checkbox
                                    id={field.name}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel htmlFor={field.name} className="text-sm font-medium">
                                    I agree to the MedScan AI terms and privacy policy
                                  </FormLabel>
                                  <p className="text-xs text-muted-foreground">
                                    Your account request will be reviewed by our compliance team before activation.
                                  </p>
                                </div>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Creating account..." : "Create account"}
                      </Button>
                    </form>
                  </Form>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-border" />
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        or
                      </span>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                    <Button type="button" variant="outline" className="w-full" disabled={isSubmitting}>
                      <Hospital className="mr-2 h-4 w-4" />
                      Sign in with hospital ID
                    </Button>
                  </div>

                  <div className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Sign in
                    </Link>
                    .
                  </div>
          
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

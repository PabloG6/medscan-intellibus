import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
]

const problemItems = [
  {
    icon: "⏱",
    title: "Time-Consuming Reviews",
    description:
      "Doctors spend hours manually reviewing medical scans, creating bottlenecks in patient care.",
  },
  {
    icon: "🔍",
    title: "Human Error Risk",
    description:
      "Manual analysis can lead to missed abnormalities or misinterpretations under time pressure.",
  },
  {
    icon: "📈",
    title: "Treatment Delays",
    description: "Slower diagnoses result in delayed treatments, potentially affecting patient outcomes.",
  },
]

const solutionStats = [
  { value: "95%", label: "Accuracy Rate" },
  { value: "80%", label: "Time Reduction" },
  { value: "24/7", label: "Availability" },
]

const workflowSteps = ["Upload Scan", "AI Analysis", "Results & Highlights"]

const features = [
  {
    title: "Instant Analysis",
    description: "Process medical scans in seconds, not hours. Get immediate feedback on potential issues.",
  },
  {
    title: "Smart Highlighting",
    description:
      "Automatically highlights suspicious areas with confidence levels and detailed annotations.",
  },
  {
    title: "Multi-Modal Support",
    description: "Works with X-rays, CT scans, MRIs, and other medical imaging formats.",
  },
  {
    title: "Report Generation",
    description: "Automated preliminary reports with findings, recommendations, and priority levels.",
  },
  {
    title: "Secure & Compliant",
    description: "HIPAA-compliant with enterprise-grade security and patient data protection.",
  },
  {
    title: "Integration Ready",
    description: "Seamlessly integrates with existing hospital information systems and workflows.",
  },
]

export default function LandingPage() {
  return (
    <div className="bg-white text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-2xl font-semibold text-black">
              MedScan AI
            </Link>
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-black transition-colors">
                {link.label}
              </Link>
            ))}
            <Link href="/login" className="rounded-md bg-black px-4 py-2 text-white hover:bg-neutral-800">
              Login
            </Link>
          </div>
          <Button asChild variant="outline" className="border-black text-black hover:bg-black hover:text-white md:hidden">
            <Link href="/login">Login</Link>
          </Button>

             <Button asChild variant="outline" className="border-black text-black hover:bg-black hover:text-white md:hidden">
            <Link href="/create-account">Create Account</Link>
          </Button>
        </nav>
      </header>

      <main>
        <section className="bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 py-20">
          <div className="container mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-2 lg:items-center lg:px-6">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight text-black sm:text-5xl">
                Revolutionary Medical Scan Analysis
              </h1>
              <p className="text-xl font-semibold text-slate-600">
                Accelerating Diagnoses, Saving Lives
              </p>
              <p className="text-lg text-slate-600">
                Transform your medical practice with AI-powered real-time scan analysis that detects abnormalities instantly and highlights areas of concern for faster, more accurate diagnoses.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  className="bg-black px-6 py-2 text-base font-semibold text-white hover:bg-neutral-800"
                >
                  <Link href="/create-account">Get Started</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-2 border-black px-6 py-2 text-base font-semibold text-black hover:bg-black hover:text-white"
                >
                  <Link href="#learn-more">Learn More</Link>
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative h-80 w-80 overflow-hidden rounded-2xl border-4 border-neutral-800 bg-black shadow-xl">
                <div
                  className="absolute inset-0 opacity-80"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
                <div className="absolute left-[25%] top-[30%] h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/70 bg-white/10 animate-pulse" />
                <div className="analysis-indicator absolute bottom-6 left-6 flex items-center gap-2 text-xs font-semibold text-white">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  Analysis Complete
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="problem" className="bg-slate-100 py-20">
          <div className="container mx-auto max-w-6xl space-y-10 px-4 lg:px-6">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-black">The Current Challenge</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {problemItems.map((item) => (
                <Card key={item.title} className="h-full border-none shadow-lg">
                  <CardHeader className="items-center text-center">
                    <div className="text-4xl">{item.icon}</div>
                    <CardTitle className="mt-2 text-xl text-black">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-slate-600">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="solution" className="py-20">
          <div className="container mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-2 lg:px-6">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-black">Our AI-Powered Solution</h2>
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-black">Real-Time Scan Analysis</h3>
                <ul className="space-y-3 text-base text-slate-600">
                  {[
                    "Instant abnormality detection using advanced AI algorithms",
                    "Automatic highlighting of areas requiring attention",
                    "Priority-based flagging system for urgent cases",
                    "Seamless integration with existing medical systems",
                    "Detailed analysis reports with confidence levels",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="mt-1 text-black">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-8">
                {solutionStats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-3xl font-semibold text-black">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="flex w-full flex-col items-center gap-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h4 className="text-xl font-semibold text-black">Streamlined Workflow</h4>
                <div className="flex w-full flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  {workflowSteps.map((step, index) => (
                    <div key={step} className="flex flex-col items-center text-center">
                      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-black text-lg font-semibold text-white">
                        {index + 1}
                      </div>
                      <p className="text-sm font-medium text-slate-600">{step}</p>
                    </div>
                  ))}
                </div>
                <ArrowRight className="hidden h-6 w-6 text-slate-400 md:block" />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="bg-slate-100 py-20">
          <div className="container mx-auto max-w-6xl space-y-10 px-4 lg:px-6">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-black">Key Features</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {features.map((feature) => (
                <Card key={feature.title} className="h-full border border-slate-200 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl text-black">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-slate-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-black py-20 text-center text-white">
          <div className="container mx-auto max-w-3xl space-y-6 px-4">
            <h2 className="text-3xl font-semibold">Ready to Transform Your Practice?</h2>
            <p className="text-base text-white/80">
              Join thousands of medical professionals who have revolutionized their diagnostic workflow.
            </p>
            <Button
              asChild
              className="bg-white px-6 py-2 text-base font-semibold text-black hover:bg-slate-200"
            >
              <Link href="/login">Start Your Free Trial</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-100 py-12">
        <div className="container mx-auto max-w-6xl space-y-10 px-4 lg:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-black">MedScan AI</h3>
              <p className="text-sm text-slate-600">
                Revolutionizing medical diagnostics through artificial intelligence.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-base font-semibold text-black">Quick Links</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="#features" className="hover:text-black">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="hover:text-black">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-black">
                    Login
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-base font-semibold text-black">Support</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="#contact" className="hover:text-black">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#help" className="hover:text-black">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#privacy" className="hover:text-black">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
            © 2025 MedScan AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

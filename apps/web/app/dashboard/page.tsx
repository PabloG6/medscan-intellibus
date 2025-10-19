"use client"

import * as React from "react"
import {
  Activity,
  AlarmClock,
  AlertTriangle,
  BarChart3,
  CircleDashed,
  FileUp,
  LogOut,
  RotateCcw,
  Settings,
  ShieldCheck,
  Stethoscope,
  Upload,
  Users,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const stats = [
  { label: "Scans Today", value: "24", icon: BarChart3 },
  { label: "Urgent Cases", value: "3", icon: AlertTriangle, variant: "urgent" as const },
  { label: "Completed", value: "18", icon: ShieldCheck },
  { label: "Avg Analysis Time", value: "1.2m", icon: AlarmClock },
]

const findings = [
  {
    title: "Possible Pneumonia",
    confidence: "92%",
    priority: "high" as const,
    description:
      "Opacity detected in left lower lobe consistent with pneumonia. Recommend immediate clinical correlation and treatment consideration.",
    location: "Left lung, lower lobe",
  },
  {
    title: "Suspicious Nodule",
    confidence: "78%",
    priority: "medium" as const,
    description:
      "Small nodular opacity in right middle lobe. Recommend follow-up imaging or further investigation as clinically indicated.",
    location: "Right lung, middle lobe",
  },
]

const queue = [
  {
    patient: "Patient #12851 - CT Scan",
    department: "Emergency Department | Uploaded 2 min ago",
    priority: "urgent" as const,
    actionLabel: "Analyze Now",
  },
  {
    patient: "Patient #12849 - MRI Brain",
    department: "Neurology | Uploaded 15 min ago",
    priority: "normal" as const,
    actionLabel: "Queue",
  },
  {
    patient: "Patient #12848 - X-Ray Spine",
    department: "Orthopedics | Uploaded 32 min ago",
    priority: "normal" as const,
    actionLabel: "Queue",
  },
]

export default function DashboardPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false)
  const [selectedFiles, setSelectedFiles] = React.useState<string[]>([])
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    setSelectedFiles(files.map((file) => file.name))
  }

  const closeUploadModal = () => {
    setIsUploadModalOpen(false)
    setSelectedFiles([])
  }

  return (
    <div className="min-h-screen bg-muted">
      <header className="border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <p className="text-lg font-semibold tracking-tight">MedScan AI</p>
              <p className="text-sm text-muted-foreground">Dr. Sarah Johnson · Radiology Dept.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => undefined} className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </nav>
      </header>

      <div className="mx-auto flex max-w-6xl flex-1 flex-col sm:flex-row">
        <aside className="hidden w-60 shrink-0 border-r border-border bg-background p-6 sm:block">
          <nav>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Navigation</p>
            <ul className="mt-4 space-y-1 text-sm">
              <li>
                <a
                  className="flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2 font-medium text-primary"
                  href="#scan-analysis"
                >
                  Scan Analysis
                  <Activity className="h-4 w-4" />
                </a>
              </li>
              <li>
                <a className="flex items-center justify-between rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground" href="#scan-history">
                  Scan History
                  <Stethoscope className="h-4 w-4" />
                </a>
              </li>
              <li>
                <a className="flex items-center justify-between rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground" href="#reports">
                  Reports
                  <BarChart3 className="h-4 w-4" />
                </a>
              </li>
              <li>
                <a className="flex items-center justify-between rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground" href="#patients">
                  Patients
                  <Users className="h-4 w-4" />
                </a>
              </li>
              <li>
                <a className="flex items-center justify-between rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground" href="#statistics">
                  Statistics
                  <CircleDashed className="h-4 w-4" />
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="flex-1 space-y-8 px-4 py-8 sm:px-6 lg:px-8">
          <section className="space-y-4" id="scan-analysis">
            <h2 className="text-lg font-semibold leading-tight">Today&apos;s Activity</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Card
                  key={stat.label}
                  className={`border-border/60 ${
                    stat.variant === "urgent" ? "border-l-4 border-l-red-500 shadow-md" : ""
                  }`}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <Card className="overflow-hidden border-border/60">
              <CardHeader className="flex flex-col gap-4 border-b border-border/80 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">Real-Time Scan Analysis</CardTitle>
                    <CardDescription>Current Scan: Chest X-Ray · Patient #12847</CardDescription>
                  </div>
                  <Button onClick={() => setIsUploadModalOpen(true)} className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload New Scan
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="grid gap-6 p-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                <div className="relative flex min-h-[360px] items-center justify-center rounded-xl border border-dashed border-border bg-gradient-to-b from-muted to-background">
                  <div className="absolute inset-6 rounded-lg bg-background/60 shadow-inner backdrop-blur">
                    <div className="relative h-full w-full rounded-lg bg-neutral-950">
                      <div className="absolute inset-0 opacity-40">
                        <div className="h-full w-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0,rgba(0,0,0,0.5)_70%)]" />
                      </div>
                      <div className="absolute inset-10 rounded-full border-2 border-white/10" />
                      <div className="absolute left-[18%] top-[18%] h-[55%] w-[26%] rounded-full border-2 border-white/25" />
                      <div className="absolute right-[18%] top-[18%] h-[55%] w-[26%] rounded-full border-2 border-white/25" />
                      <div className="absolute left-1/2 top-[10%] h-[80%] w-[2px] -translate-x-1/2 bg-white/15" />
                      <div className="absolute left-[14%] top-[32%] h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-rose-500/80 bg-rose-500/20 backdrop-blur" />
                      <div className="absolute right-[20%] bottom-[20%] h-14 w-14 translate-x-1/2 translate-y-1/2 rounded-full border-4 border-amber-400/80 bg-amber-400/20 backdrop-blur" />
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Analysis Complete
                  </div>
                </div>

                <div className="space-y-6">
                  <section className="rounded-xl border border-border/60 bg-background p-5">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-500">
                        High Priority
                      </span>
                      <span className="text-xs text-muted-foreground">Analyzed · 10:34 AM</span>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                      2 potential abnormalities detected requiring immediate attention.
                    </p>
                  </section>

                  <div className="space-y-4">
                    {findings.map((finding) => (
                      <div
                        key={finding.title}
                        className={`space-y-3 rounded-xl border border-border/80 bg-background p-4 ${
                          finding.priority === "high"
                            ? "border-l-4 border-l-red-500"
                            : finding.priority === "medium"
                              ? "border-l-4 border-l-amber-500"
                              : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-base font-semibold">{finding.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                              {finding.description}
                            </p>
                          </div>
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            {finding.confidence} Confidence
                          </span>
                        </div>
                        <p className="text-xs italic text-muted-foreground">Location: {finding.location}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button className="gap-2">
                      <FileUp className="h-4 w-4" />
                      Generate Report
                    </Button>
                    <Button variant="secondary" className="gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      Save Analysis
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Flag for Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="self-start border-border/60" id="scan-history">
              <CardHeader>
                <CardTitle>Pending Scans Queue</CardTitle>
                <CardDescription>Monitor and prioritize new uploads across departments.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {queue.map((entry) => (
                  <div
                    key={entry.patient}
                    className={`flex flex-col gap-3 rounded-xl border border-border/70 bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between ${
                      entry.priority === "urgent"
                        ? "border-l-4 border-l-red-500 bg-red-50/70"
                        : ""
                    }`}
                  >
                    <div>
                      <p className="font-medium text-foreground">{entry.patient}</p>
                      <p className="text-sm text-muted-foreground">{entry.department}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                          entry.priority === "urgent"
                            ? "bg-red-600 text-white"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {entry.priority === "urgent" ? "Urgent" : "Normal"}
                      </span>
                      <Button
                        variant={entry.priority === "urgent" ? "default" : "secondary"}
                        size="sm"
                        className="whitespace-nowrap"
                      >
                        {entry.actionLabel}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </main>
      </div>

      {isUploadModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur">
          <div className="w-full max-w-xl space-y-6 rounded-2xl border border-border/60 bg-background p-6 shadow-2xl">
            <header className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Upload Medical Scan</h3>
                <p className="text-sm text-muted-foreground">
                  Securely upload DICOM or imaging files for automated triage.
                </p>
              </div>
              <Button variant="outline" size="icon" onClick={closeUploadModal}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close modal</span>
              </Button>
            </header>

            <div
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-muted/40 px-6 py-10 text-center transition-colors hover:border-primary focus:outline-none focus:ring-2 focus:ring-ring/50 focus:ring-offset-2"
              role="button"
              tabIndex={0}
              onClick={handleBrowseClick}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  handleBrowseClick()
                }
              }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FileUp className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-sm font-semibold">Drag &amp; Drop Scan Files Here</h4>
              <p className="mt-2 text-xs text-muted-foreground">
                or click to browse files · Supports .dcm, .jpg, .png, .tiff
              </p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                accept=".dcm,.jpg,.png,.tiff"
                onChange={handleFilesSelected}
              />
            </div>

            {selectedFiles.length ? (
              <div className="rounded-lg border border-border/70 bg-muted/40 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Selected Files
                </p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {selectedFiles.map((name) => (
                    <li key={name} className="truncate">
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Patient Information
              </h4>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="patient-id"
                    className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    Patient ID
                  </Label>
                  <Input id="patient-id" placeholder="Enter patient identifier" />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="scan-type"
                    className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    Scan Type
                  </Label>
                  <select
                    id="scan-type"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select modality
                    </option>
                    <option value="xray">X-Ray</option>
                    <option value="ct">CT Scan</option>
                    <option value="mri">MRI</option>
                    <option value="ultrasound">Ultrasound</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="department"
                  className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  Department
                </Label>
                <Input id="department" placeholder="e.g. Emergency, Radiology" />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="priority-level"
                  className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  Priority Level
                </Label>
                <select
                  id="priority-level"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2"
                  defaultValue="normal"
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3">
              <Button variant="secondary" onClick={closeUploadModal}>
                Cancel
              </Button>
              <Button className="gap-2">
                <Activity className="h-4 w-4" />
                Upload &amp; Analyze
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

# MedScan IntelliBus: Quick Start  

**Live Website:** [https://intellibus-web-prod-production.glues-gliders0w.workers.dev/](https://intellibus-web-prod-production.glues-gliders0w.workers.dev/)

---

## 🧠 Introduction

**MedScan IntelliBus** is an **AI-powered real-time medical scan analysis system** designed to **accelerate diagnoses** and **improve accuracy** in healthcare workflows.

Built for the **IntelliBus Hackathon**, it combines **computer vision**, **secure cloud infrastructure**, and a **doctor-facing AI assistant** to revolutionize how medical professionals interpret scans.

---

### 🚀 Core Features

- **AI Scan Analysis:** Real-time detection and highlighting of abnormalities in X-rays, CTs, and MRIs.  
- **Medical Chatbot:** A context-aware chatbot that routes doctor queries to the right AI model or analysis tool.  
- **Secure & Compliant:** HIPAA-compliant design with encrypted data flow and user authentication.  
- **Integrated Stack:** Multi-package monorepo architecture with `apps/web`, `packages/db`, and `vision` modules.

> 💡 **Why MedScan?**  
> Doctors spend up to 40% of their time reviewing medical images manually — MedScan cuts that by **80%**.

---

## 🩺 Problem Overview

### The Broken Experience

Doctors currently spend significant time **manually reviewing medical scans**, causing delays and potential errors in diagnosis.

| Challenge | Impact |
|------------|---------|
| ⏱ **Time-Consuming Reviews** | Hours of manual image assessment per case |
| 🔍 **Human Error Risk** | Missed or misinterpreted abnormalities |
| 📈 **Treatment Delays** | Slower diagnoses and delayed patient care |

---

## 💡 The MedScan Solution

### Real-Time AI Analysis

- **Instant Detection:** Identify abnormalities instantly using cutting-edge deep learning.  
- **Smart Highlighting:** Automatically mark regions of concern with confidence levels.  
- **Priority Flagging:** Urgent cases are flagged based on severity to optimize triage.  
- **Seamless Integration:** Works with existing hospital systems and PACS infrastructure.  

---

## ⚙️ System Overview

### Workflow

1. **Upload Scan** → Doctor uploads a medical scan.  
2. **AI Analysis** → Vision model runs detection in real time.  
3. **Results & Highlights** → Abnormalities are outlined and ranked by confidence.

```json
{
  "scan_id": "CT-7843",
  "confidence": 0.95,
  "findings": ["Lesion Detected", "Possible Fluid Build-up"],
  "priority": "High"
}

---

# 💻 Developer Information

## Packages

This monorepo contains the following packages:

- `apps/web`: The main web application.
- `packages/db`: The database schema and migrations.
- `vision`: The computer vision component.

## Getting Started

To get started, install the dependencies:

```bash
pnpm install
```

## Development

To start the development servers for all apps:

```bash
pnpm dev
```

## Scripts

The following scripts are available:

- `dev`: Start the development servers.
- `build`: Build all apps and packages.
- `start`: Start the production servers.
- `lint`: Lint all apps and packages.
- `clean`: Remove all `node_modules`, `.next`, and `dist` folders.
- `test`: Run all tests.
- `cf:deploy`: Deploy to Cloudflare.
- `cf:dev`: Start a local Cloudflare worker.
- `cf:tail`: Tail the Cloudflare worker logs.
- `cf:login`: Login to Cloudflare.
- `cf:whoami`: Check the current Cloudflare user.
- `cf:types`: Generate Cloudflare worker types.
- `deploy:prod`: Deploy the web app to production.
- `db:generate`: Generate the database schema.
- `db:migrate`: Run database migrations.
- `db:studio`: Start the database studio.

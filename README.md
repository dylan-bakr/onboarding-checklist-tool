# Onboarding Checklist Tool

A containerized web application for creating, customizing, and exporting employee onboarding checklists.

## Features

- **Supervisor Interface** – Enter new employee details and select a predefined role pathway
- **Custom Onboarding Checklist** – Customize timing assignments for 49+ onboarding tasks with filtering and sorting
- **Output Template** – Preview and export a formatted PDF checklist
- **Master List** – View, filter, and add tasks to the master task database
- **Feedback Database** – Tracks all exported selections (Date, Job Code, Task #, Timing) with CSV export
- **PDF Export** – Generates a professionally formatted PDF using the Milliman color palette

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **State**: Zustand (with localStorage persistence)
- **PDF**: jsPDF + jspdf-autotable
- **Container**: Docker + Nginx
- **Linting**: ESLint + Prettier
- **Pre-commit**: Husky + lint-staged

## Development

```bash
# Install dependencies
npm install

# Start dev server at localhost:3000
npm run dev

# Lint
npm run lint

# Format
npm run format

# Build for production
npm run build
```

## Docker

```bash
# Production container (serves at port 3000)
docker compose up

# Or build manually
docker build -t onboarding-checklist-tool .
docker run -p 3000:80 onboarding-checklist-tool
```

## DevContainer

Open in VS Code with the Dev Containers extension for a pre-configured development environment.

## CI/CD

The GitHub Actions workflow (`.github/workflows/build.yml`) triggers on `v*` tags and:
1. Lints and type-checks the code
2. Builds the production bundle
3. Builds a Docker image and exports it as a downloadable zip artifact

The zip contains a gzipped Docker image tar (`onboarding-checklist-tool-<version>.tar.gz`). Download it from the workflow run's **Artifacts** section, then load and run it:

```bash
# Inflate and load the image
unzip onboarding-checklist-tool-v1.0.0.zip
docker load < onboarding-checklist-tool-v1.0.0.tar.gz

# Run the container
docker run -p 3000:80 onboarding-checklist-tool:v1.0.0
```

To trigger a build:

```bash
git tag v1.0.0
git push origin v1.0.0
```

# Onboarding Checklist Tool

A containerized web application for creating, customizing, and exporting employee onboarding checklists.

## Features

- **Supervisor Interface** – Enter new employee details and select a job title (drives timing pre-fills for defined role pathways)
- **Custom Onboarding Checklist** – Customize timing assignments for 50 onboarding tasks with filtering and sorting; required tasks cannot be excluded
- **Output Template** – Preview and export a formatted PDF checklist
- **Master List** – View, filter, and add tasks to the master task database
- **Feedback Database** – Tracks all exported selections (Date, Task #, Timing) with CSV export
- **PDF Export** – Generates a professionally formatted PDF using the Milliman color palette

## Tech Stack

### Production

| Package               | Version | Purpose                                   |
| --------------------- | ------- | ----------------------------------------- |
| `react` / `react-dom` | ^19.2.4 | UI framework                              |
| `tailwindcss`         | ^4.2.2  | Utility-first CSS                         |
| `zustand`             | ^5.0.12 | State management (localStorage-persisted) |
| `jspdf`               | ^4.2.1  | PDF generation                            |
| `jspdf-autotable`     | ^5.0.7  | Table rendering in PDFs                   |

### Development

| Package                 | Version  | Purpose                     |
| ----------------------- | -------- | --------------------------- |
| Node.js                 | 24       | Runtime (devcontainer & CI) |
| `vite`                  | ^8.0.5   | Dev server & bundler        |
| `typescript`            | ~5.9.3   | Type checking               |
| `eslint`                | ^9.39.4  | Linting (flat config)       |
| `prettier`              | ^3.8.1   | Code formatting             |
| `husky` + `lint-staged` | ^9 / ^16 | Pre-commit hooks            |

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

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## v0.2.0

### Changed

- Replaced the checkbox in the PDF Status column with an interactive `AcroFormComboBox`; the field defaults to **Not Started** and offers **Started** and **Completed** as selectable options

## v0.1.0

### Added

- Required tasks list: 17 tasks are now locked as non-excludable; their checkboxes are disabled and "Exclude" is hidden from their timing dropdown
- Stable row ordering in the Custom Onboarding Checklist: rows no longer re-sort while timing values are being edited, only when the sort column/direction or filters change
- Bundled Benton Sans (regular + bold) fonts into PDF exports

### Changed

- Replaced the free-text Job Code input and separate Role Pathway dropdown on the Supervisor Interface with a single required Job Title selector; selecting Actuarial Analyst or Software Developer still pre-fills role-specific default timings
- Job Title is now a required field — the form will not advance without a selection
- Output Template header simplified: Supervisor field removed from the on-screen preview

### Removed

- Job Code field from employee info and from Feedback Database entries (CSV export columns: Date, Task #, Timing)
- Standalone Role Pathway selector (consolidated into Job Title)

## v0.0.0

### Added

- initial project setup with React 19, Vite, TypeScript, Tailwind CSS, and Docker configuration
- repository health checks configurations for eslint and prettier
- basic UI components and routing structure
- state management with Zustand
- PDF generation functionality using jsPDF and jsPDF-AutoTable
- build pipeline with GitHub Actions for linting, testing, and Docker image building
- devcontainer configuration for consistent development environment

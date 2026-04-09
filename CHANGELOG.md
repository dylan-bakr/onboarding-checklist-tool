# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- PDF viewer modal for S Drive links ending in `.pdf`: clicking the link opens a modal (blurred background, rounded corners) that shows the network path for reference and lets the user open the file locally to view it inline
- shared `WhoHowLink` component extracted from the three view components to centralise link-rendering and PDF-detection logic
- bundled asset support: tasks whose S Drive link has a corresponding `bundledAsset` now load from the app bundle instead of requiring the user to open from the network drive; bundled PDFs render immediately in the viewer modal, bundled `.docx` files are offered as direct downloads

### Changed

- S Drive links that point to `.pdf` files now display as "PDF" instead of the task-specific text

## v0.2.1

### Fixed

- data mismatch that was preventing our role pathway/job title logic from firing

## v0.2.0

### Added

- standalone Role Pathway selector
- clickable links to Who / How details in the PDF export, master list view, customization, and output preview screens

### Changed

- pre-selected onboarding tasks can now be selected independently from job title; selecting Actuarial Analyst or Software Developer still pre-fills role-specific default timings
- the checkbox in the PDF Status column with an interactive `AcroFormComboBox`

## v0.1.0

### Added

- required tasks list
- stable row ordering during customization
- benton sans (regular + bold) fonts into asset bundle and export

### Changed

- the free-text Job Code input and separate Role Pathway dropdown on the Supervisor Interface into a single required Job Title selector; selecting Actuarial Analyst or Software Developer still pre-fills role-specific default timings
- Job Title is now a required field — the form will not advance without a selection
- Output Template header presentation simplified

### Removed

- Job Code field from employee info and from Feedback Database entries
- standalone Role Pathway selector

## v0.0.0

### Added

- initial project setup with React 19, Vite, TypeScript, Tailwind CSS, and Docker configuration
- repository health checks configurations for eslint and prettier
- basic UI components and routing structure
- state management with Zustand
- PDF generation functionality using `jsPDF` and `jsPDF-AutoTable`
- build pipeline with GitHub Actions for linting, testing, and Docker image building
- devcontainer configuration for consistent development environment

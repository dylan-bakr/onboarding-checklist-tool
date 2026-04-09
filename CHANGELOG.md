# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- In-app preview modal for bundled assets: clicking a Who / How link that has a bundled asset opens a modal (blurred backdrop, rounded corners) that displays the content inline
- PDF preview via `<iframe>` for the Concur Expense Report Job Aid (task 24)
- Markdown document preview (fetched and rendered as pre-formatted text) for the Milliman ChatGPT guide (task 20) and Exam Reimbursement Request intro (task 25)
- Source path shown at the top of the preview modal as a one-click copy button for easy reference
- Shared `WhoHowLink` component and `PreviewModal` component extracted from the three view components

### Changed

- Who / How link text for bundled PDF assets now reads "Preview PDF"; for bundled Markdown assets it reads "Preview Doc"

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

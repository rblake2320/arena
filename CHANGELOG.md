# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

### Added

- Rebuilt the full-stack TypeScript application into a working state with a clean router, API layer, and seed database.
- Added a baseline Node test command (`npm test`) to enforce a quality gate.

### Changed

- Reorganized backend modules into `db.ts`, `api.ts`, and `server.ts` with stable imports.
- Replaced corrupted front-end files with functional React pages for home and candidate dashboard views.
- Refreshed static shell files (`index.html`, `index.css`) and project docs.

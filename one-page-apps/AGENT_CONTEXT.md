# Agent Context: one-page-apps

## 1. Repository Purpose

one-page-apps stores AI-generated one-page web apps used in NorthStar course workflows. It serves as a lightweight app gallery with catalog metadata and a simple publishing pipeline.

## 2. Key Locations

- Root: `./`
- Gallery shell: `index.html`, `style.css`, `app.js`
- App pages: `apps/<app-name>/index.html`
- Agent definitions: `.github/agents/`
- Deployment workflow: `.github/workflows/deploy-pages.yml`

## 3. Core Operations

- Import a generated app into `apps/<app-name>/`.
- Register or update app metadata in `app.js` (`appCatalog`).
- Keep `projectDocumentation` in `app.js` aligned with `README.md` and agent files.
- Validate links and paths before publishing.

## 4. Two-Way Workspace Context

- Inbound context sources:
  - `nsa-content-general`: app requirements tied to general course content.
  - `nsa-pbr`: app requirements tied to PBR lessons and activities.
  - AI generation tools: exported HTML and optional assets.
- Outbound coordination targets:
  - `nsa-design-system`: brand/style alignment for Moodle-facing presentation.
  - `nsa-content-general` and `nsa-pbr`: final placement in curriculum pages.
  - `nsa-tools`: workspace-level instruction and automation updates.

## 5. Constraints

- Keep each app self-contained in its own folder under `apps/`.
- Use relative app links in `app.js` (`./apps/<app-name>/index.html`).
- Avoid editing unrelated app folders during imports.
- Keep documentation claims factual and verifiable.

## 6. Validation Checklist

1. App path exists and opens from gallery.
2. `app.js` contains a single catalog entry per app ID.
3. `projectDocumentation.status.lastUpdated` uses `YYYY-MM-DD`.
4. `README.md` workflow sections match current behavior.
5. Agent file references in docs point to existing files.

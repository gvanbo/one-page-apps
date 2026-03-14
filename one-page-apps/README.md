# one-page-apps

This repository is a gallery of one-page apps exported from Google Gemini Canvas.

## Gemini Prompt Template

Use `GEMINI_APP_CREATION_TEMPLATE.md` before generating a new app to keep quality, tech choices, and CSS conventions consistent.

## Automation Agent

Use the custom workspace agent `gemini-app-importer` to automate app onboarding:

1. Open Copilot Chat and select the `gemini-app-importer` agent.
2. Provide app metadata (name, title, description, tags) plus generated HTML.
3. The agent creates `apps/<app-name>/index.html`, updates `app.js`, and validates changes.

Use the custom workspace agent `documentation-accuracy-guardian` to keep docs aligned with repository state:

1. Open Copilot Chat and select the `documentation-accuracy-guardian` agent.
2. Ask for a documentation audit and sync.
3. The agent verifies `app.js` documentation fields, checks file references, and updates `README.md`/`app.js` as needed.

## Structure

- `index.html`: Gallery homepage
- `app.js`: Catalog entries for all apps
- `style.css`: Shared gallery styles
- `apps/<app-name>/index.html`: Individual app pages

## Add a New Gemini Canvas App

1. Create a new folder under `apps`, for example `apps/my-new-app`.
2. Put your exported app entry file in `apps/my-new-app/index.html`.
3. Add an entry to the `appCatalog` array in `app.js`:

```js
{
  id: 'my-new-app',
  title: 'My New App',
  description: 'Short summary of what this app does.',
  path: './apps/my-new-app/index.html',
  tags: ['gemini-canvas']
}
```

4. Open `index.html` in a browser and launch from the gallery.

## Update Status Checklist

Run this checklist after every app import or structural change:

1. Update `projectDocumentation.status` in `app.js`.
2. Add or revise one bullet in `projectDocumentation.changes` in `app.js`.
3. Verify every `projectDocumentation.references[].path` exists.
4. Update `projectDocumentation.status.lastUpdated` with current date (`YYYY-MM-DD`).
5. Confirm README workflow and agent sections still match implementation.
6. Reload `index.html` and verify the documentation section renders correctly.

## Publish with GitHub Pages

This repository is configured to deploy with GitHub Actions using `.github/workflows/deploy-pages.yml`.

[![Deploy GitHub Pages](https://github.com/gvanbo/one-page-apps/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/gvanbo/one-page-apps/actions/workflows/deploy-pages.yml)

Workflow runs and logs:

- https://github.com/gvanbo/one-page-apps/actions/workflows/deploy-pages.yml

One-time setup in GitHub:

1. Open repository Settings -> Pages.
2. Under Build and deployment, set Source to GitHub Actions.
3. Push to `main` (or `master`) to trigger deployment.

Expected site URL:

- `https://gvanbo.github.io/one-page-apps/`

Notes:

- Deploy runs on each push to `main` and `master`.
- If your default branch is `main`, merge there to publish the latest site.

## Notes

- Keep each app self-contained inside its own folder.
- If Gemini exports external assets, place them in that app folder.
- Prefer clear folder names (`kebab-case`) so links stay consistent.

# one-page-apps

This repository is a gallery of one-page apps exported from Google Gemini Canvas.

## Gemini Prompt Template

Use `GEMINI_APP_CREATION_TEMPLATE.md` before generating a new app to keep quality, tech choices, and CSS conventions consistent.

## Automation Agent

Use the custom workspace agent `gemini-app-importer` to automate app onboarding:

1. Open Copilot Chat and select the `gemini-app-importer` agent.
2. Provide app metadata (name, title, description, tags) plus generated HTML.
3. The agent creates `apps/<app-name>/index.html`, updates `app.js`, and validates changes.

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

## Notes

- Keep each app self-contained inside its own folder.
- If Gemini exports external assets, place them in that app folder.
- Prefer clear folder names (`kebab-case`) so links stay consistent.

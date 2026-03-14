# Gemini Web App Creation Template

Use this template as your pre-prompt to Gemini before generating any new app for this repository.

## 1) App Request

Project name: <app-name>

One-line purpose:
<what this app does>

Target users:
<who uses it>

Core user actions (top 3):

1. <action 1>
2. <action 2>
3. <action 3>

## 2) Repository Constraints (Must Follow)

- Output must be a one-page web app that runs locally in a browser.
- App must be placed in: apps/<app-name>/index.html
- Keep app self-contained unless external files are explicitly requested.
- Do not break existing gallery conventions.
- Assume this app will be linked from the catalog in app.js.

## 3) Technology Standards

- HTML5, modern CSS, and vanilla JavaScript by default.
- No build step unless explicitly requested.
- No framework dependency unless requested (React, Vue, etc.).
- If a library is used, prefer CDN links and explain why it is needed.
- Keep JavaScript modular and readable; avoid global pollution.

## 4) Quality Bar

- Clear information hierarchy and intuitive layout.
- Fully responsive for mobile and desktop.
- Keyboard accessible interactive controls.
- Visible focus states for interactive elements.
- Semantic HTML (header, main, section, nav, button, form labels).
- Good contrast and readable typography.
- Loading, empty, and error states where applicable.
- No console errors.

## 5) CSS Standards

- Define design tokens in :root (colors, spacing, radius, shadows).
- Use a consistent naming approach for classes.
- Avoid inline styles except truly dynamic values.
- Avoid hardcoded random values; prefer tokenized spacing scale.
- Ensure typography scale is deliberate (title, subtitle, body, meta).
- Provide subtle but intentional hover/focus/active states.
- Include at least one thoughtful visual layer (gradient, pattern, or depth).
- Keep motion minimal and purposeful; respect reduced-motion when used.

## 6) Performance + Maintainability

- Keep DOM structure simple.
- Avoid unnecessary re-renders or heavy effects.
- Minimize dependencies.
- Add concise comments only where logic is non-obvious.
- Keep code easy to hand off and edit.

## 7) Required Deliverables From Gemini

Gemini should return:

1. Complete index.html for the app.
2. Brief implementation notes (3-8 bullets).
3. Any assumptions made.
4. Quick test checklist.

## 8) Acceptance Checklist (Pass/Fail)

- [ ] Runs by opening index.html directly in browser.
- [ ] Works on mobile and desktop widths.
- [ ] Meets accessibility and semantic requirements.
- [ ] Meets CSS token and style consistency requirements.
- [ ] Meets requested feature set.
- [ ] No obvious visual or functional regressions.

## 9) Copy/Paste Prompt Block

Use everything below as your Gemini prompt, then replace bracket placeholders.

---

Create a one-page web app for this repository.

App name: [app-name]
Purpose: [one-line purpose]
Target users: [audience]
Top 3 user actions:

1. [action]
2. [action]
3. [action]

Hard constraints:

- Build as a single-page app that runs locally in browser.
- Deliver code for apps/[app-name]/index.html.
- Use HTML5 + modern CSS + vanilla JavaScript unless I explicitly request a framework.
- Keep it accessible, responsive, and production-quality.
- Use CSS variables in :root for design tokens.
- Include clear focus states and semantic structure.
- Avoid unnecessary libraries.

Design direction:
[describe mood, tone, brand colors, or references]

Features required:

- [feature 1]
- [feature 2]
- [feature 3]

Output format:

1. Full index.html
2. Short implementation notes
3. Assumptions
4. Test checklist

---

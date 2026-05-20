Albertgrad - Static Package for Cloudflare R2

Contents:
- index.html — Runnable demo (CDN React + Babel) ready to upload to a static object store.
- alberta-grad-planning-full.jsx — Full component source (for bundling in a build step).

Goal:
Provide a folder you can upload to Cloudflare R2 (or any static hosting). `index.html` is a self-contained demo
that uses CDN-hosted React and Babel for quick testing. This is suitable for staging or R2 object hosting,
but note that runtime Babel/JSX transform in the browser is not recommended for production.

Recommended production approach (optional):
1) Build a production bundle locally with `esbuild` or `vite` to produce a minified `app.js` and a compiled
   Tailwind CSS file. This avoids in-browser Babel and is faster and more secure.

Example (esbuild) — run from this `dist/` folder after installing esbuild globally or in a project:

```bash
# from apps/10-12/dist/
npm init -y
npm install --save-dev esbuild
# copy the full component source into src/App.jsx (or point esbuild to the path of the source)
npx esbuild --bundle ../alberta-grad-planning-full.jsx --minify --sourcemap --outfile=app.js --loader:.jsx=jsx
```

Then update `index.html` to load `app.js` instead of the in-browser Babel script, e.g.:

```html
<script src="app.js"></script>
```

Uploading to Cloudflare R2:
- R2 is an object store. Upload all files in this `dist/` folder as objects.
- If you plan to serve a single-page app (SPA), you may want to use Cloudflare Pages or a Worker to
  enable `index.html` fallback on unknown paths. For a single-file demo (index.html only) R2 can
  serve it via a worker or via a static hosting integration.

Quick upload (using `rclone` as an example):

```bash
# Configure rclone with Cloudflare R2 once.
# Then:
rclone copy ./ r2:my-bucket/albertgrad --progress
```

Notes & tradeoffs:
- Current `index.html` uses the CDN React + Babel standalone approach for quick deployment; it's fine
  for demos and early testing, but you should build a production bundle for a school-facing environment.
- Tailwind CDN is used for styles; if you build, compile Tailwind to reduce CSS size.

Need help?
- I can produce a production `app.js` and an optimized `index.html` for you and place them in this folder.
- Tell me whether you want me to: (A) produce a production bundle here now, or (B) leave the demo as-is.

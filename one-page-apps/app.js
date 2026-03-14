const appCatalog = [
  {
    id: "hello-world",
    title: "Hello World Starter",
    description:
      "A simple baseline one-page app you can clone for new Gemini Canvas exports.",
    path: "./apps/hello-world/index.html",
    color: "#2563eb",
    tags: ["starter", "vanilla-js"],
  },
];

const projectDocumentation = {
  status: {
    phase: "Gallery infrastructure active",
    summary:
      "Homepage catalog, import workflow guidance, and custom importer agent are in place.",
    lastUpdated: "2026-03-14",
  },
  changes: [
    "Created gallery homepage with dynamic app cards and launch links.",
    "Added standardized Gemini pre-prompt template for quality and CSS consistency.",
    "Added custom workspace agent for app import automation.",
  ],
  references: [
    {
      label: "Importer Agent",
      path: "./.github/agents/gemini-app-importer.agent.md",
      note: "Automation instructions for adding new generated apps.",
    },
    {
      label: "Gemini Prompt Template",
      path: "./GEMINI_APP_CREATION_TEMPLATE.md",
      note: "Source template shared with Gemini before app generation.",
    },
    {
      label: "Catalog Registry",
      path: "./app.js",
      note: "Defines app cards and records project documentation content.",
    },
    {
      label: "Repository Guide",
      path: "./README.md",
      note: "Explains structure and operator workflow.",
    },
  ],
};

function pickColor(entry, index) {
  if (entry.color) {
    return entry.color;
  }

  const fallbackPalette = [
    "#2563eb",
    "#0ea5e9",
    "#059669",
    "#9333ea",
    "#d97706",
  ];
  return fallbackPalette[index % fallbackPalette.length];
}

function renderCatalog(apps) {
  const appRoot = document.getElementById("app");

  if (!appRoot) {
    return;
  }

  if (!apps.length) {
    appRoot.innerHTML =
      '<p class="empty">No apps yet. Add one in the apps folder and update app.js.</p>';
    return;
  }

  appRoot.innerHTML = apps
    .map((entry, index) => {
      const cardColor = pickColor(entry, index);

      return `
        <article class="card" aria-labelledby="${entry.id}-title" style="--card-accent: ${cardColor};">
                <div class="card-top">
                    <h2 id="${entry.id}-title">${entry.title}</h2>
                    <p>${entry.description}</p>
                </div>
                <div class="meta">
                    ${entry.tags.map((tag) => `<span>${tag}</span>`).join("")}
                </div>
                <a class="launch" href="${entry.path}">Open App</a>
            </article>
      `;
    })
    .join("");
}

function renderProjectDocumentation(doc) {
  const docsRoot = document.getElementById("project-docs");

  if (!docsRoot) {
    return;
  }

  const statusCard = `
    <article class="doc-card" aria-labelledby="doc-status-title">
      <h3 id="doc-status-title">Current Status</h3>
      <p class="doc-lead">${doc.status.phase}</p>
      <p>${doc.status.summary}</p>
      <p class="doc-meta">Last Updated: ${doc.status.lastUpdated}</p>
    </article>
  `;

  const changesCard = `
    <article class="doc-card" aria-labelledby="doc-changes-title">
      <h3 id="doc-changes-title">Changes Made</h3>
      <ul class="doc-list">
        ${doc.changes.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    </article>
  `;

  const referencesCard = `
    <article class="doc-card" aria-labelledby="doc-refs-title">
      <h3 id="doc-refs-title">Important Agent Files</h3>
      <ul class="doc-list doc-links">
        ${doc.references
          .map(
            (entry) =>
              `<li><a href="${entry.path}">${entry.label}</a><p>${entry.note}</p></li>`,
          )
          .join("")}
      </ul>
    </article>
  `;

  docsRoot.innerHTML = `${statusCard}${changesCard}${referencesCard}`;
}

document.addEventListener("DOMContentLoaded", () => {
  renderCatalog(appCatalog);
  renderProjectDocumentation(projectDocumentation);
});

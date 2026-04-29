"use strict";

var appCatalog = [{
  id: "hello-world",
  title: "Hello World Starter",
  description: "A simple baseline one-page app you can clone for new Gemini Canvas exports.",
  path: "./apps/hello-world/index.html",
  color: "#2563eb",
  tags: ["starter", "vanilla-js"]
}];
var projectDocumentation = {
  status: {
    phase: "Workspace onboarded with two-way context",
    summary: "Gallery infrastructure is active, one-page-apps is now mapped in the NSA workspace, and custom agents include cross-repo inbound/outbound routing guidance.",
    lastUpdated: "2026-04-29"
  },
  changes: ["Created gallery homepage with dynamic app cards and launch links.", "Added standardized Gemini pre-prompt template for quality and CSS consistency.", "Added custom workspace agent for app import automation.", "Added documentation audit agent and update-status checklist workflow.", "Added AGENT_CONTEXT.md and two-way workspace handoff guidance for one-page-app agents."],
  references: [{
    label: "Repository Agent Context",
    path: "./AGENT_CONTEXT.md",
    note: "Defines purpose, constraints, and two-way cross-repo routing."
  }, {
    label: "Importer Agent",
    path: "./.github/agents/gemini-app-importer.agent.md",
    note: "Automation instructions for adding new generated apps."
  }, {
    label: "Documentation Accuracy Agent",
    path: "./.github/agents/documentation-accuracy-guardian.agent.md",
    note: "Audits and synchronizes status, change log, and key file references."
  }, {
    label: "Gemini Prompt Template",
    path: "./GEMINI_APP_CREATION_TEMPLATE.md",
    note: "Source template shared with Gemini before app generation."
  }, {
    label: "Catalog Registry",
    path: "./app.js",
    note: "Defines app cards and records project documentation content."
  }, {
    label: "Repository Guide",
    path: "./README.md",
    note: "Explains structure and operator workflow."
  }, {
    label: "Status Update Checklist",
    path: "./README.md",
    note: "Operational checklist used after imports and structural changes."
  }]
};

function pickColor(entry, index) {
  if (entry.color) {
    return entry.color;
  }

  var fallbackPalette = ["#2563eb", "#0ea5e9", "#059669", "#9333ea", "#d97706"];
  return fallbackPalette[index % fallbackPalette.length];
}

function renderCatalog(apps) {
  var appRoot = document.getElementById("app");

  if (!appRoot) {
    return;
  }

  if (!apps.length) {
    appRoot.innerHTML = '<p class="empty">No apps yet. Add one in the apps folder and update app.js.</p>';
    return;
  }

  appRoot.innerHTML = apps.map(function (entry, index) {
    var cardColor = pickColor(entry, index);
    return "\n        <article class=\"card\" aria-labelledby=\"".concat(entry.id, "-title\" style=\"--card-accent: ").concat(cardColor, ";\">\n                <div class=\"card-top\">\n                    <h2 id=\"").concat(entry.id, "-title\">").concat(entry.title, "</h2>\n                    <p>").concat(entry.description, "</p>\n                </div>\n                <div class=\"meta\">\n                    ").concat(entry.tags.map(function (tag) {
      return "<span>".concat(tag, "</span>");
    }).join(""), "\n                </div>\n                <a class=\"launch\" href=\"").concat(entry.path, "\">Open App</a>\n            </article>\n      ");
  }).join("");
}

function renderProjectDocumentation(doc) {
  var docsRoot = document.getElementById("project-docs");

  if (!docsRoot) {
    return;
  }

  var statusCard = "\n    <article class=\"doc-card\" aria-labelledby=\"doc-status-title\">\n      <h3 id=\"doc-status-title\">Current Status</h3>\n      <p class=\"doc-lead\">".concat(doc.status.phase, "</p>\n      <p>").concat(doc.status.summary, "</p>\n      <p class=\"doc-meta\">Last Updated: ").concat(doc.status.lastUpdated, "</p>\n    </article>\n  ");
  var changesCard = "\n    <article class=\"doc-card\" aria-labelledby=\"doc-changes-title\">\n      <h3 id=\"doc-changes-title\">Changes Made</h3>\n      <ul class=\"doc-list\">\n        ".concat(doc.changes.map(function (item) {
    return "<li>".concat(item, "</li>");
  }).join(""), "\n      </ul>\n    </article>\n  ");
  var referencesCard = "\n    <article class=\"doc-card\" aria-labelledby=\"doc-refs-title\">\n      <h3 id=\"doc-refs-title\">Important Files for Agents</h3>\n      <ul class=\"doc-list doc-links\">\n        ".concat(doc.references.map(function (entry) {
    return "<li><a href=\"".concat(entry.path, "\">").concat(entry.label, "</a><p>").concat(entry.note, "</p></li>");
  }).join(""), "\n      </ul>\n    </article>\n  ");
  docsRoot.innerHTML = "".concat(statusCard).concat(changesCard).concat(referencesCard);
}

document.addEventListener("DOMContentLoaded", function () {
  renderCatalog(appCatalog);
  renderProjectDocumentation(projectDocumentation);
});
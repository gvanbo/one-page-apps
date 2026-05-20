import React, { useState, useMemo, useEffect } from "react";

// NOTE: This file is adapted from the original `alberta-grad-planning.html` React component.
// It may reference browser globals like `crypto.randomUUID()` and `localStorage`.

export default function App() {
  // Minimal version: load preset and export handlers. For full fidelity, run the original file.
  const STEM_PRESET = [
    {
      id: "1",
      name: "English Language Arts 10-1",
      gradeLevel: 10,
      credits: 5,
      mark: 85,
      category: "English",
      is30Level: false,
      isExternal: false,
    },
    {
      id: "2",
      name: "Social Studies 10-1",
      gradeLevel: 10,
      credits: 5,
      mark: 82,
      category: "Social Studies",
      is30Level: false,
      isExternal: false,
    },
    {
      id: "3",
      name: "Mathematics 10C",
      gradeLevel: 10,
      credits: 5,
      mark: 88,
      category: "Mathematics",
      is30Level: false,
      isExternal: false,
    },
  ];

  const [plannedCourses, setPlannedCourses] = useState(() => {
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("alberta_grad_planner_courses")
        : null;
    return saved ? JSON.parse(saved) : STEM_PRESET;
  });
  const [theme, setTheme] = useState("dark");
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "alberta_grad_planner_courses",
        JSON.stringify(plannedCourses),
      );
    }
  }, [plannedCourses]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const audit = useMemo(() => {
    const validCourses = plannedCourses.filter(
      (c) => c.mark === null || c.mark === undefined || c.mark >= 50,
    );
    const totalCredits = validCourses.reduce((s, c) => s + (c.credits || 0), 0);
    const hasEnglish30 = validCourses.some(
      (c) => c.category === "English" && c.is30Level && c.credits >= 5,
    );
    const rulesList = [
      {
        id: "credits",
        label: "Earn at least 100 high school credits",
        met: totalCredits >= 100,
        current: `${totalCredits}/100 cr`,
      },
      {
        id: "english",
        label: "English Language Arts 30-level",
        met: hasEnglish30,
        current: hasEnglish30 ? "Satisfied" : "Missing 30-level",
      },
    ];
    const satisfiedCount = rulesList.filter((r) => r.met).length;
    const readinessPercentage = Math.round(
      (satisfiedCount / rulesList.length) * 100,
    );
    const averageMark = plannedCourses.filter((c) => c.mark != null).length
      ? Math.round(
          plannedCourses
            .filter((c) => c.mark != null)
            .reduce((s, c) => s + c.mark, 0) /
            plannedCourses.filter((c) => c.mark != null).length,
        )
      : null;
    return {
      totalCredits,
      rulesList,
      satisfiedCount,
      readinessPercentage,
      averageMark,
    };
  }, [plannedCourses]);

  const buildSummaryText = () =>
    `\nALBERTA HIGH SCHOOL GRADUATION PLAN\n\nTotal Planned Credits: ${audit.totalCredits} credits\nGrad Requirements Satisfied: ${audit.satisfiedCount} / ${audit.rulesList.length}\nAverage Course Mark: ${audit.averageMark ?? "N/A"}\n\nCourses:\n${plannedCourses.map((c) => `- ${c.name} (${c.credits} cr, Mark: ${c.mark ?? "Planned"})`).join("\n")}\n`;

  const handleCopySummary = () => {
    const text = buildSummaryText();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => showToast("Copied to clipboard"))
        .catch(() => {
          showToast("Copy failed");
        });
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showToast("Copied to clipboard");
    }
  };

  const handleDownloadSummary = () => {
    const blob = new Blob([buildSummaryText()], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `albertgrad-plan-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Downloaded");
  };

  const handleExportJSON = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      audit,
      plannedCourses,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `albertgrad-plan-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Exported JSON");
  };

  return (
    <div
      className={`min-h-screen p-6 ${theme === "dark" ? "bg-slate-900 text-white" : "bg-white text-slate-900"}`}
    >
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ALBERTGRAD</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            className="px-3 py-1 rounded bg-slate-800 text-white"
          >
            Toggle Theme
          </button>
        </div>
      </header>

      <main className="grid gap-4 md:grid-cols-2">
        <section>
          <h2 className="font-bold mb-2">Planned Courses</h2>
          <ul className="space-y-2">
            {plannedCourses.map((c) => (
              <li key={c.id} className="p-3 rounded border bg-slate-800/30">
                {c.name} — {c.credits} cr — {c.mark ?? "Planned"}
              </li>
            ))}
          </ul>
        </section>

        <aside>
          <h2 className="font-bold mb-2">Audit</h2>
          <div className="p-3 rounded border mb-3">
            Credits: {audit.totalCredits}
          </div>
          <div className="space-y-2">
            {audit.rulesList.map((r) => (
              <div
                key={r.id}
                className="flex justify-between items-center p-2 border rounded"
              >
                {" "}
                <div>{r.label}</div> <div>{r.met ? "✓" : "✗"}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={handleCopySummary}
              className="px-3 py-2 rounded bg-indigo-600 text-white"
            >
              Copy
            </button>
            <button
              onClick={handleDownloadSummary}
              className="px-3 py-2 rounded bg-slate-800 text-white"
            >
              Download .txt
            </button>
            <button
              onClick={handleExportJSON}
              className="px-3 py-2 rounded bg-emerald-600 text-white"
            >
              Export JSON
            </button>
          </div>
        </aside>
      </main>

      {toastMessage && (
        <div className="fixed right-4 bottom-4 bg-indigo-600 text-white px-4 py-2 rounded">
          {toastMessage}
        </div>
      )}

      <footer className="mt-8 text-xs text-slate-400">
        © 2026 Albertgrad Prototype
      </footer>
    </div>
  );
}

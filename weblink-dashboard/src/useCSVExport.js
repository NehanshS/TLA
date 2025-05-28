// useCSVExport.js
import { useState } from "react";

// Helper: convert array of objects to CSV string (Excel-safe, JSON parse-safe)
function toCSV(rows, options = {}) {
  const keys = Object.keys(rows[0] || {});
  const csvRows = [
    keys.join(","), // header
    ...rows.map(row =>
      keys
        .map(k =>
          typeof row[k] === "number"
            ? row[k].toFixed(2)
            : `"${String(row[k] ?? "").replace(/"/g, '""')}"`
        )
        .join(",")
    )
  ];
  return csvRows.join("\r\n");
}

export function useCSVExport({ projectId, modelId, token, metrics, projectName }) {
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState("");

  const exportCSV = async () => {
    setExporting(true);
    setToast("");

    try {
      // 1. Fetch model info to get commit/timestamp
      const modelRes = await fetch(
        `https://app.speckle.systems/api/v1/projects/${projectId}/models/${modelId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const model = await modelRes.json();
      const commitId = model.model.versions?.[0]?.id?.slice?.(0, 8) || "latest";
      const commitTime = model.model.versions?.[0]?.createdAt || new Date().toISOString();

      // 2. Prepare the row (current dashboard metrics)
      const csvRow = {
        projectName: projectName || model.model.name || "",
        commitId,
        commitTime: new Date(commitTime).toISOString(),
        ...Object.fromEntries(
          Object.entries(metrics).map(([k, v]) => [
            k,
            v == null ? "" : typeof v === "number" ? Number(v).toFixed(2) : v
          ])
        )
      };

      // 3. Download CSV (single row)
      const csv = toCSV([csvRow]);
      const safeProj = (csvRow.projectName || "SpeckleProject").replace(/[^\w\d-]/g, "_");
      const filename = `${safeProj}_${commitId}_${csvRow.commitTime.replace(/[:.]/g, "-")}.csv`;
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1500);

      setToast("CSV exported successfully!");
    } catch (err) {
      setToast("Export failed!");
    }
    setExporting(false);
    setTimeout(() => setToast(""), 2500);
  };

  return { exportCSV, exporting, toast };
}

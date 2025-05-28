import { useState } from "react";

// Helper: convert array of objects to CSV string (Excel-safe, JSON parse-safe)
function toCSV(rows) {
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

export function useCSVExport({ streamId, versionId, token, metrics, projectName }) {
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState("");

  const exportCSV = async () => {
    setExporting(true);
    setToast("");

    try {
      // 1. Fetch latest version/commit info via GraphQL if versionId isn't provided
      let actualVersionId = versionId;
      let commitTime = new Date().toISOString();
      let streamName = projectName || "SpeckleProject";

      if (!actualVersionId) {
        const query = `
          query GetVersions($projectId: String!) {
            project(id: $projectId) {
              versions(limit: 1) {
                items {
                  id
                  createdAt
                  author { name }
                }
              }
              name
            }
          }
        `;
        const variables = { projectId: streamId };
        const gqlRes = await fetch("https://app.speckle.systems/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ query, variables })
        });
        const gqlData = await gqlRes.json();
        const version = gqlData?.data?.project?.versions?.items?.[0] || {};
        actualVersionId = version.id?.slice?.(0, 8) || "latest";
        commitTime = version.createdAt || commitTime;
        streamName = gqlData?.data?.project?.name || streamName;
      }

      // 2. Prepare the row (current dashboard metrics)
      const csvRow = {
        projectName: streamName,
        versionId: actualVersionId,
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
      const filename = `${safeProj}_${actualVersionId}_${csvRow.commitTime.replace(/[:.]/g, "-")}.csv`;
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

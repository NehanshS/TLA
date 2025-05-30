// components/ExportCSV.jsx
import { useCSVExport } from "../useCSVExport";
import { useEffect } from "react";

// ENV: use VITE_SPECKLE_STREAM_ID for project/stream, optional VITE_SPECKLE_VERSION_ID
const STREAM_ID = import.meta.env.VITE_SPECKLE_STREAM_ID;
const VERSION_ID = import.meta.env.VITE_SPECKLE_VERSION_ID; // usually leave blank unless you want to export a specific commit
const TOKEN = import.meta.env.VITE_SPECKLE_TOKEN;

export default function ExportCSV({ metrics, projectName, versionId }) {
  // versionId (prop) overrides the .env default if provided
  const { exportCSV, exporting, toast } = useCSVExport({
    streamId: STREAM_ID,
    versionId: versionId || VERSION_ID,
    token: TOKEN,
    metrics,
    projectName,
  });

  // Optional: ESC to close toast (future: you could implement clearToast in useCSVExport)
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        // Example: add clearToast() to useCSVExport to handle this
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div style={{ display: "inline-block", position: "relative" }}>
      <button
        className="rounded px-3 py-1 border border-gray-700 bg-[#19191b] hover:bg-[#232325] text-white transition disabled:opacity-50"
        onClick={exportCSV}
        disabled={exporting}
        aria-busy={exporting}
        style={{
          fontFamily: "'Acumin Variable Concept', system-ui, sans-serif",
          fontWeight: 400,
          letterSpacing: "0.06em",
          cursor: exporting ? "not-allowed" : "pointer"
        }}
      >
        {exporting ? "Exporting..." : "Export CSV"}
      </button>
      {toast && (
        <div
          className="fixed top-6 right-8 z-[9999] p-3 rounded bg-green-600 text-white shadow-lg"
          style={{
            fontSize: "1.04rem",
            fontWeight: 400,
            pointerEvents: "none",
            transition: "opacity 0.3s"
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

// components/ExportCSV.jsx
import { useCSVExport } from "../useCSVExport";
import { useEffect } from "react";

// Use your .env setup for token/stream IDs
const STREAM_ID = import.meta.env.VITE_SPECKLE_STREAM_ID;
const TOKEN = import.meta.env.VITE_SPECKLE_TOKEN;

export default function ExportCSV({ metrics, projectName }) {
  const { exportCSV, exporting, toast } = useCSVExport({
    streamId: STREAM_ID,
    token: TOKEN,
    metrics,
    projectName
  });

  // Optional: ESC to close toast (add toast clear logic if desired)
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        // Implement toast clear if your useCSVExport supports it
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

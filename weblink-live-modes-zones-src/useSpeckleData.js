import { useEffect, useState } from "react";

// Use VITE_ prefix for Vite environment variables!
const SPECKLE_API = "https://app.speckle.systems/api/v1";
const STREAM_ID = import.meta.env.VITE_SPECKLE_STREAM_ID;
const TOKEN = import.meta.env.VITE_SPECKLE_TOKEN;

const METRICS = [
  "EUI", "Circulation", "ClearancesMet", "EquipmentCount",
  "MaterialCost", "EquipmentCost", "LayoutScore", "EUIScore", "EstimatedWorkers"
];

// Recursively extract all matching numeric values for metrics and also collect all worksets/zones found.
function recursiveExtract(obj, keys, result = {}, worksets = new Set(), zones = new Set()) {
  if (!obj) return;

  // Collect workset and zone names from parameters, if available
  let worksetName = null;
  let zoneName = null;
  if (obj.parameters) {
    if (obj.parameters.Workset?.value) {
      worksetName = obj.parameters.Workset.value;
      worksets.add(worksetName);
    }
    if (obj.parameters.ScopeBox?.value) {
      zoneName = obj.parameters.ScopeBox.value;
      zones.add(zoneName);
    }
    if (obj.parameters.ViewName?.value) {
      zones.add(obj.parameters.ViewName.value);
    }
  }
  if (obj.workset) { worksets.add(obj.workset); worksetName = obj.workset; }
  if (obj.scopeBoxName) { zones.add(obj.scopeBoxName); zoneName = obj.scopeBoxName; }
  if (obj.view) { zones.add(obj.view); zoneName = obj.view; }
  obj._workset = worksetName;
  obj._zone = zoneName;

  // Save matching values
  if (obj.parameters) {
    keys.forEach((key) => {
      if (
        obj.parameters[key] &&
        (typeof obj.parameters[key].value === "number" ||
          !isNaN(parseFloat(obj.parameters[key].value)))
      ) {
        result[key] = (result[key] ?? 0) + parseFloat(obj.parameters[key].value);
      }
    });
  }
  keys.forEach((key) => {
    if (
      obj[key] &&
      (typeof obj[key] === "number" || !isNaN(parseFloat(obj[key])))
    ) {
      result[key] = (result[key] ?? 0) + parseFloat(obj[key]);
    }
  });

  // Recursively process elements/children
  if (Array.isArray(obj.elements)) {
    obj.elements.forEach((child) =>
      recursiveExtract(child, keys, result, worksets, zones)
    );
  }
  if (Array.isArray(obj.children)) {
    obj.children.forEach((child) =>
      recursiveExtract(child, keys, result, worksets, zones)
    );
  }
}

// Recursively sum only elements matching the mode/zone filter
function sumFiltered(obj, keys, result = {}, filter) {
  if (!obj) return result;

  const matchesMode =
    filter.mode === "All" ||
    (obj.parameters && obj.parameters.Workset && obj.parameters.Workset.value === filter.mode) ||
    (obj._workset && obj._workset === filter.mode);

  const matchesZone =
    filter.zone === "All" ||
    (obj.parameters && obj.parameters.ScopeBox && obj.parameters.ScopeBox.value === filter.zone) ||
    (obj._zone && obj._zone === filter.zone);

  if (matchesMode && matchesZone) {
    if (obj.parameters) {
      keys.forEach((key) => {
        if (
          obj.parameters[key] &&
          (typeof obj.parameters[key].value === "number" ||
            !isNaN(parseFloat(obj.parameters[key].value)))
        ) {
          result[key] = (result[key] ?? 0) + parseFloat(obj.parameters[key].value);
        }
      });
    }
    keys.forEach((key) => {
      if (
        obj[key] &&
        (typeof obj[key] === "number" || !isNaN(parseFloat(obj[key])))
      ) {
        result[key] = (result[key] ?? 0) + parseFloat(obj[key]);
      }
    });
  }

  if (Array.isArray(obj.elements)) {
    obj.elements.forEach((child) =>
      sumFiltered(child, keys, result, filter)
    );
  }
  if (Array.isArray(obj.children)) {
    obj.children.forEach((child) =>
      sumFiltered(child, keys, result, filter)
    );
  }

  return result;
}

export default function useSpeckleData({ mode, zone }) {
  const [data, setData] = useState({
    loading: true,
    error: null,
    projectName: "",
    updatedAt: "",
    availableModes: ["All"],
    availableZones: ["All"],
    ...Object.fromEntries(METRICS.map((k) => [k, null]))
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        // Step 1: Get the list of commits for the stream (get latest commit)
        const commitsRes = await fetch(
          `${SPECKLE_API}/streams/${STREAM_ID}/commits`,
          { headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {} }
        );
        if (!commitsRes.ok) throw new Error("Failed to fetch commits");
        const commits = await commitsRes.json();
        const latestCommit = commits.items?.[0];
        if (!latestCommit) throw new Error("No commits found for stream");
        const commitId = latestCommit.id;
        const projectName = latestCommit.stream?.name || "Speckle Project";
        const updatedAt = latestCommit.createdAt;

        // Step 2: Get root object for latest commit
        const objRes = await fetch(
          `${SPECKLE_API}/streams/${STREAM_ID}/commits/${commitId}/object`,
          { headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {} }
        );
        if (!objRes.ok) throw new Error("Failed to fetch commit object");
        const { object } = await objRes.json();

        // Step 3: Extract all available modes/zones and metrics
        const allWorksets = new Set();
        const allZones = new Set();
        const initialMetrics = {};
        recursiveExtract(object, METRICS, initialMetrics, allWorksets, allZones);

        // Provide unique names only, prepend "All"
        const availableModes = ["All", ...Array.from(allWorksets).filter(Boolean)];
        const availableZones = ["All", ...Array.from(allZones).filter(Boolean)];

        // Step 4: Filter values based on current mode/zone
        const metrics = sumFiltered(object, METRICS, {}, { mode, zone });

        if (!cancelled)
          setData({
            loading: false,
            error: null,
            projectName,
            updatedAt,
            availableModes,
            availableZones,
            ...Object.fromEntries(
              METRICS.map((k) => [k, metrics[k] ?? null])
            )
          });
      } catch (error) {
        if (!cancelled)
          setData((prev) => ({
            ...prev,
            loading: false,
            error: error.message || "Failed to load data"
          }));
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, [mode, zone]);

  return data;
}

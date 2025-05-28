import { useEffect, useState } from "react";

const SPECKLE_API = "https://app.speckle.systems";
const PROJECT_ID = import.meta.env.VITE_SPECKLE_PROJECT_ID;
const MODEL_ID = import.meta.env.VITE_SPECKLE_MODEL_ID;
const TOKEN = import.meta.env.REACT_APP_SPECKLE_TOKEN;

// All possible keys in Speckle/Revit for your metrics:
const SPECKLE_KEYS = {
  clearance: ["ClearancesMet", "clearance", "Clearance"],
  equipment: ["EquipmentCount", "equipment", "Equipment"],
  circulation: ["Circulation", "circulation"],
  layoutScore: ["LayoutScore", "layoutScore", "Layout_Score"],
  euiScore: ["EUIScore", "euiScore", "EUI_Score"],
  estimatedWorkers: ["EstimatedWorkers", "estimatedWorkers", "Workers", "workers"],
  materialCost: ["MaterialCost", "materialCost"],
  equipmentCost: ["EquipmentCost", "equipmentCost"],
  // Add others if your naming changes
};

function getMetric(obj, keys) {
  // Look for all possible naming conventions
  for (const key of keys) {
    // Check in parameters
    if (obj.parameters && obj.parameters[key]) {
      let v = obj.parameters[key].value ?? obj.parameters[key];
      if (!isNaN(parseFloat(v))) return parseFloat(v);
    }
    // Check as direct property
    if (!isNaN(parseFloat(obj[key]))) return parseFloat(obj[key]);
  }
  return 0;
}

// Recursively find all Worksets and Zones (ScopeBoxes/Views), and sum all metrics per filter
function scanObjectTree(obj, filters = { mode: "All", zone: "All" }, scanOptions = {}) {
  if (!obj) return scanOptions;

  // --- Collect workset and zone names ---
  let worksetName = null;
  let zoneName = null;
  if (obj.parameters) {
    if (obj.parameters.Workset?.value) {
      worksetName = obj.parameters.Workset.value;
      scanOptions.worksets.add(worksetName);
    }
    if (obj.parameters.ScopeBox?.value) {
      zoneName = obj.parameters.ScopeBox.value;
      scanOptions.zones.add(zoneName);
    }
    if (obj.parameters.ViewName?.value) {
      scanOptions.zones.add(obj.parameters.ViewName.value);
    }
  }
  if (obj.workset) { scanOptions.worksets.add(obj.workset); worksetName = obj.workset; }
  if (obj.scopeBoxName) { scanOptions.zones.add(obj.scopeBoxName); zoneName = obj.scopeBoxName; }
  if (obj.view) { scanOptions.zones.add(obj.view); zoneName = obj.view; }

  // Filtering for summing
  const matchesMode =
    filters.mode === "All" ||
    worksetName === filters.mode;
  const matchesZone =
    filters.zone === "All" ||
    zoneName === filters.zone;

  // --- Sum metrics for matching elements ---
  if (matchesMode && matchesZone) {
    for (const [field, keys] of Object.entries(SPECKLE_KEYS)) {
      scanOptions.metrics[field] = (scanOptions.metrics[field] ?? 0) + getMetric(obj, keys);
    }
  }

  // Scan children recursively
  if (Array.isArray(obj.elements)) obj.elements.forEach(child => scanObjectTree(child, filters, scanOptions));
  if (Array.isArray(obj.children)) obj.children.forEach(child => scanObjectTree(child, filters, scanOptions));

  return scanOptions;
}

export default function useSpeckleData({ mode = "All", zone = "All" }) {
  const [data, setData] = useState({
    loading: true,
    error: null,
    projectName: "",
    updatedAt: "",
    availableModes: ["All"],
    availableZones: ["All"],
    clearance: null,
    equipment: null,
    circulation: null,
    layoutScore: null,
    euiScore: null,
    estimatedWorkers: null,
    materialCost: null,
    equipmentCost: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        // Fetch model for project name, date, etc
        const modelRes = await fetch(
          `${SPECKLE_API}/projects/${PROJECT_ID}/models/${MODEL_ID}`,
          { headers: { Authorization: `Bearer ${TOKEN}` } }
        );
        if (!modelRes.ok) throw new Error("Failed to fetch model");
        const model = await modelRes.json();
        const projectName = model.model.name;
        const updatedAt = model.model.versions?.[0]?.createdAt || "";
        const latestVersionId = model.model.versions?.[0]?.id;
        if (!latestVersionId) throw new Error("No versions found for model");

        // Fetch root object for model data
        const objRes = await fetch(
          `${SPECKLE_API}/projects/${PROJECT_ID}/models/${MODEL_ID}/versions/${latestVersionId}/object`,
          { headers: { Authorization: `Bearer ${TOKEN}` } }
        );
        if (!objRes.ok) throw new Error("Failed to fetch object");
        const { object } = await objRes.json();

        // Scan and sum metrics, collect worksets/zones
        const scan = scanObjectTree(
          object,
          { mode, zone },
          { metrics: {}, worksets: new Set(), zones: new Set() }
        );
        const availableModes = ["All", ...Array.from(scan.worksets).filter(Boolean)];
        const availableZones = ["All", ...Array.from(scan.zones).filter(Boolean)];

        if (!cancelled) {
          setData({
            loading: false,
            error: null,
            projectName,
            updatedAt,
            availableModes,
            availableZones,
            clearance: scan.metrics.clearance || null,
            equipment: scan.metrics.equipment || null,
            circulation: scan.metrics.circulation || null,
            layoutScore: scan.metrics.layoutScore || null,
            euiScore: scan.metrics.euiScore || null,
            estimatedWorkers: scan.metrics.estimatedWorkers || null,
            materialCost: scan.metrics.materialCost || null,
            equipmentCost: scan.metrics.equipmentCost || null,
          });
        }
      } catch (error) {
        if (!cancelled)
          setData((prev) => ({
            ...prev,
            loading: false,
            error: error.message || "Failed to load data"
          }));
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, [mode, zone]);

  return data;
}

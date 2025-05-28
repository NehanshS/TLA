import { useEffect, useState } from "react";

const GRAPHQL = "https://app.speckle.systems/graphql";
const PROJECT_ID = import.meta.env.VITE_SPECKLE_STREAM_ID;
const TOKEN = import.meta.env.VITE_SPECKLE_TOKEN;

// Possible keys for each metric
const SPECKLE_KEYS = {
  clearance: ["ClearancesMet", "clearance", "Clearance"],
  equipment: ["EquipmentCount", "equipment", "Equipment"],
  circulation: ["Circulation", "circulation"],
  layoutScore: ["LayoutScore", "layoutScore", "Layout_Score"],
  euiScore: ["EUIScore", "euiScore", "EUI_Score"],
  estimatedWorkers: ["EstimatedWorkers", "estimatedWorkers", "Workers", "workers"],
  materialCost: ["MaterialCost", "materialCost"],
  equipmentCost: ["EquipmentCost", "equipmentCost"],
};

function getMetric(obj, keys) {
  for (const key of keys) {
    if (obj.parameters && obj.parameters[key]) {
      let v = obj.parameters[key].value ?? obj.parameters[key];
      if (!isNaN(parseFloat(v))) return parseFloat(v);
    }
    if (!isNaN(parseFloat(obj[key]))) return parseFloat(obj[key]);
  }
  return 0;
}

function scanObjectTree(obj, filters = { mode: "All", zone: "All" }, scanOptions = {}) {
  if (!obj) return scanOptions;

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

  const matchesMode =
    filters.mode === "All" ||
    worksetName === filters.mode;
  const matchesZone =
    filters.zone === "All" ||
    zoneName === filters.zone;

  if (matchesMode && matchesZone) {
    for (const [field, keys] of Object.entries(SPECKLE_KEYS)) {
      scanOptions.metrics[field] = (scanOptions.metrics[field] ?? 0) + getMetric(obj, keys);
    }
  }

  if (Array.isArray(obj.elements)) obj.elements.forEach(child => scanObjectTree(child, filters, scanOptions));
  if (Array.isArray(obj.children)) obj.children.forEach(child => scanObjectTree(child, filters, scanOptions));

  return scanOptions;
}

// Simple GraphQL fetch helper
async function gqlRequest({ query, variables = {}, token }) {
  const res = await fetch(GRAPHQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ query, variables })
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors.map(e => e.message).join("\n"));
  return json.data;
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
        // 1. Get latest version (commit) for project/stream
        const versionData = await gqlRequest({
          query: `
            query ($projectId: String!) {
              project(id: $projectId) {
                name
                versions(limit: 1) {
                  items {
                    id
                    referencedObject
                    createdAt
                  }
                }
              }
            }
          `,
          variables: { projectId: PROJECT_ID },
          token: TOKEN
        });
        const project = versionData.project;
        const latestVersion = project.versions.items[0];
        if (!latestVersion) throw new Error("No versions found for this project.");
        const referencedObjectId = latestVersion.referencedObject;

        // 2. Get root object (deep, recursive - this could be optimized by only getting fields you need)
        const objectData = await gqlRequest({
          query: `
            query ($projectId: String!, $objectId: String!) {
              project(id: $projectId) {
                object(id: $objectId) {
                  id
                  parameters
                  elements { id parameters }
                  children { id parameters }
                  // Add more nesting if your tree is deeper
                }
              }
            }
          `,
          variables: { projectId: PROJECT_ID, objectId: referencedObjectId },
          token: TOKEN
        });

        // 3. Parse and aggregate metrics
        const rootObj = objectData.project.object;
        const scan = scanObjectTree(
          rootObj,
          { mode, zone },
          { metrics: {}, worksets: new Set(), zones: new Set() }
        );
        const availableModes = ["All", ...Array.from(scan.worksets).filter(Boolean)];
        const availableZones = ["All", ...Array.from(scan.zones).filter(Boolean)];

        if (!cancelled) {
          setData({
            loading: false,
            error: null,
            projectName: project.name || "Speckle Project",
            updatedAt: latestVersion.createdAt,
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
    console.log(data)
    return () => { cancelled = true; };
  }, [mode, zone]);

  return data;
}

import { useEffect, useState } from "react";

// Speckle API Config
const GRAPHQL = "https://app.speckle.systems/graphql";
const PROJECT_ID = import.meta.env.VITE_SPECKLE_STREAM_ID; // a.k.a. "project" or "stream" ID
const TOKEN = import.meta.env.VITE_SPECKLE_TOKEN;

// Map metrics to all naming possibilities (for legacy/future-proofing)
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

// Get metric from any object.data by possible keys
function getMetric(obj, keys) {
  if (!obj?.data) return 0;
  for (const key of keys) {
    const val = obj.data[key];
    if (typeof val === "object" && val?.value !== undefined) {
      if (!isNaN(parseFloat(val.value))) return parseFloat(val.value);
    }
    if (!isNaN(parseFloat(val))) return parseFloat(val);
  }
  return 0;
}

// Recursively scan for metrics, worksets, zones
function scanObjectTree(obj, filters = { mode: "All", zone: "All" }, scanOptions = {}) {
  if (!obj || typeof obj !== "object") return scanOptions;
  // Track modes/zones for filters
  const worksetName = obj.data?.Workset || obj.data?.workset || null;
  const zoneName =
    obj.data?.ScopeBox || obj.data?.scopeBoxName || obj.data?.ViewName || obj.data?.view || null;

  if (!scanOptions.worksets) scanOptions.worksets = new Set();
  if (!scanOptions.zones) scanOptions.zones = new Set();
  if (!scanOptions.metrics) scanOptions.metrics = {};

  if (worksetName) scanOptions.worksets.add(worksetName);
  if (zoneName) scanOptions.zones.add(zoneName);

  // Filtering
  const matchesMode = filters.mode === "All" || worksetName === filters.mode;
  const matchesZone = filters.zone === "All" || zoneName === filters.zone;

  // Sum all metric fields if matching
  if (matchesMode && matchesZone) {
    for (const [metric, keys] of Object.entries(SPECKLE_KEYS)) {
      scanOptions.metrics[metric] = (scanOptions.metrics[metric] ?? 0) + getMetric(obj, keys);
    }
  }

  // Recursively scan children (if present)
  if (Array.isArray(obj.children)) {
    obj.children.forEach(child => scanObjectTree(child, filters, scanOptions));
  }
  // Speckle's GraphQL returns child objects as .children.objects
  if (obj.children?.objects && Array.isArray(obj.children.objects)) {
    obj.children.objects.forEach(child => scanObjectTree(child, filters, scanOptions));
  }
  // Some objects may have 'elements'
  if (Array.isArray(obj.elements)) {
    obj.elements.forEach(child => scanObjectTree(child, filters, scanOptions));
  }
  if (obj.elements?.objects && Array.isArray(obj.elements.objects)) {
    obj.elements.objects.forEach(child => scanObjectTree(child, filters, scanOptions));
  }
  return scanOptions;
}

// Simple GraphQL fetch (with error handling)
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
        // 1. Get latest version (commit) for the project
        const versionQuery = `
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
        `;
        const versionData = await gqlRequest({
          query: versionQuery,
          variables: { projectId: PROJECT_ID },
          token: TOKEN
        });
        const project = versionData.project;
        const latestVersion = project.versions.items[0];
        if (!latestVersion) throw new Error("No versions found for this project.");
        const referencedObjectId = latestVersion.referencedObject;

        // 2. Get root object and recursively children (two levels for performance, expand if needed)
        const objectQuery = `
          query ($projectId: String!, $objectId: String!) {
            project(id: $projectId) {
              object(id: $objectId) {
                id
                data
                children {
                  totalCount
                  objects {
                    id
                    data
                    children {
                      totalCount
                      objects {
                        id
                        data
                      }
                    }
                  }
                }
              }
            }
          }
        `;
        const objectData = await gqlRequest({
          query: objectQuery,
          variables: { projectId: PROJECT_ID, objectId: referencedObjectId },
          token: TOKEN
        });

        // Flatten tree into a single array for easy scanning (root + children + grandchildren)
        const rootObj = objectData.project.object;
        let allObjs = [rootObj];
        if (rootObj.children?.objects) {
          allObjs = allObjs.concat(rootObj.children.objects);
          rootObj.children.objects.forEach(child => {
            if (child.children?.objects) {
              allObjs = allObjs.concat(child.children.objects);
            }
          });
        }

        // 3. Scan and aggregate metrics
        const scan = allObjs.reduce(
          (agg, obj) => scanObjectTree(obj, { mode, zone }, agg),
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
          setData(prev => ({
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

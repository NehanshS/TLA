import { useState, useEffect, useRef, useCallback } from "react";

// Helper for value randomization
function randomizeValue(value, isInt = false) {
  const factor = 1 + (Math.random() * 0.1 - 0.05);
  const newValue = value * factor;
  return isInt ? Math.round(newValue) : Math.round(newValue * 100) / 100;
}

const modeList = [
  "Workset – Assembly Line A",
  "Planning – Logistics",
  "Review – QA",
];
const zoneList = [
  "Zone 1 – Staging",
  "Zone 2 – Material Handling",
  "Zone 3 – Final Assembly",
];

export default function useMockData() {
  // PROJECT VARIABLE
  const [projectName, setProjectName] = useState("Gigafactory Austin – North Wing");

  // MODES and ZONES
  const [modeIdx, setModeIdx] = useState(0);
  const [zoneIdx, setZoneIdx] = useState(0);

  // DATA
  const [data, setData] = useState({
    header: {
      facilityScore: 97,
      lastSynced: "just now",
    },
    cost: {
      equipmentCost: 2.43,
      materialCost: 1.68,
      totalCost: 4.11,
    },
    metrics: {
      clearance: 91,
      equipment: 157,
      circulation: 78,
      layoutScore: 87,
      euiScore: 42,
      estimatedWorkers: 320,
    }
  });

  const lastUpdateRef = useRef(Date.now());

  // Update metrics and cost every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      lastUpdateRef.current = Date.now();

      setData((prev) => {
        const newMetrics = {
          clearance: randomizeValue(prev.metrics.clearance, false),
          equipment: randomizeValue(prev.metrics.equipment, true),
          circulation: randomizeValue(prev.metrics.circulation, false),
          layoutScore: randomizeValue(prev.metrics.layoutScore, false),
          euiScore: randomizeValue(prev.metrics.euiScore, false),
          estimatedWorkers: randomizeValue(prev.metrics.estimatedWorkers, true),
        };

        const newCost = {
          equipmentCost: randomizeValue(prev.cost.equipmentCost, false),
          materialCost: randomizeValue(prev.cost.materialCost, false),
        };
        newCost.totalCost = Math.round((newCost.equipmentCost + newCost.materialCost) * 100) / 100;

        // Update facility score ±5%
        const facilityScore = randomizeValue(prev.header.facilityScore, false);

        return {
          ...prev,
          header: {
            ...prev.header,
            facilityScore,
            lastSynced: "just now",
          },
          cost: newCost,
          metrics: newMetrics,
        };
      });
    }, 10000);

    // "Last Synced" text
    const timer = setInterval(() => {
      setData((prev) => {
        const seconds = Math.round((Date.now() - lastUpdateRef.current) / 1000);
        let label = "";
        if (seconds < 20) label = "just now";
        else if (seconds < 60) label = `<${seconds} seconds ago>`;
        else label = `<${Math.floor(seconds / 60)} min ago>`;
        return {
          ...prev,
          header: { ...prev.header, lastSynced: label },
        };
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  // FUNCTIONS to switch modes/zones
  const nextMode = useCallback(() => setModeIdx(i => (i + 1) % modeList.length), []);
  const prevMode = useCallback(() => setModeIdx(i => (i - 1 + modeList.length) % modeList.length), []);
  const nextZone = useCallback(() => setZoneIdx(i => (i + 1) % zoneList.length), []);
  const prevZone = useCallback(() => setZoneIdx(i => (i - 1 + zoneList.length) % zoneList.length), []);

  return {
    header: {
      ...data.header,
      projectName,
      setProjectName,
    },
    cost: data.cost,
    metrics: data.metrics,
    mode: modeList[modeIdx],
    zone: zoneList[zoneIdx],
    modes: modeList,
    zones: zoneList,
    setProjectName,
    nextMode,
    prevMode,
    nextZone,
    prevZone,
  };
}

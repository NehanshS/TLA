import { useState } from "react";

// These lists should match your app's logic
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

export default function useSpeckleData() {
  // --- Project, Modes, Zones
  const [projectName, setProjectName] = useState("Gigafactory Austin – North Wing");
  const [modeIdx, setModeIdx] = useState(0);
  const [zoneIdx, setZoneIdx] = useState(0);

  // --- Static data (update with live Speckle data later)
  const [data] = useState({
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

  // Functions for switching modes/zones
  const nextMode = () => setModeIdx(i => (i + 1) % modeList.length);
  const prevMode = () => setModeIdx(i => (i - 1 + modeList.length) % modeList.length);
  const nextZone = () => setZoneIdx(i => (i + 1) % zoneList.length);
  const prevZone = () => setZoneIdx(i => (i - 1 + zoneList.length) % zoneList.length);

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

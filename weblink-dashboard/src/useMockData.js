// src/useMockData.js
import { useState, useEffect, useRef } from "react";

// Helper: randomize a value by ±5%
function randomizeValue(value, isInt = false) {
  const factor = 1 + (Math.random() * 0.1 - 0.05); // -5% to +5%
  const newValue = value * factor;
  return isInt ? Math.round(newValue) : Math.round(newValue * 100) / 100;
}

export default function useMockData() {
  const [data, setData] = useState({
    header: {
      projectName: "Gigafactory Austin – North Wing",
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
    },
    mode: "Workset – Assembly Line A",
    zone: "Zone 1 – Staging",
  });

  // Track how many seconds since last update for "lastSynced"
  const lastUpdateRef = useRef(Date.now());

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
            lastSynced: "just now", // Will update with timer below
          },
          cost: newCost,
          metrics: newMetrics,
        };
      });
    }, 10000);

    // Sub-interval for "lastSynced" time ago
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

  return data;
}

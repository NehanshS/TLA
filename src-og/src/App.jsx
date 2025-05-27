import { useState } from "react";
import HeaderRow from "./components/HeaderRow";
import ViewportGrid from "./components/ViewportGrid";
import ViewportOverlay from "./components/ViewportOverlay";
import SpeckleViewer from "./components/SpeckleViewer";
import FloatingSwitchers from "./components/FloatingSwitchers";
import CostPanel from "./components/CostPanel";
import VerticalMetrics from "./components/VerticalMetrics";
import useSpeckleData from "./useSpeckleData";

// (Optional) Get the Speckle embed URL from .env if needed
const embedUrl = import.meta.env.VITE_SPECKLE_EMBED_URL || "";

export default function App() {
  // -- State for dynamic Mode and Zone --
  const [mode, setMode] = useState("All");
  const [zone, setZone] = useState("All");

  // -- Main data hook: provides all live values and the switcher options --
  const data = useSpeckleData({ mode, zone });

  if (data.loading) return (
    <div className="relative bg-black text-white w-screen h-screen flex items-center justify-center">
      <span style={{ fontSize: "2rem" }}>Loading...</span>
    </div>
  );
  if (data.error) return (
    <div className="relative bg-black text-white w-screen h-screen flex items-center justify-center">
      <span style={{ color: "#ff3333", fontSize: "2rem" }}>
        Error: {data.error}
      </span>
    </div>
  );

  // Metrics to pass to metrics panel
  const metrics = {
    clearance: data.ClearancesMet,
    equipment: data.EquipmentCount,
    circulation: data.Circulation,
    layoutScore: data.LayoutScore,
    euiScore: data.EUIScore,
    estimatedWorkers: data.EstimatedWorkers
  };

  // Example for facility score, last sync, etc. You may adjust how these are calculated.
  const facilityScore = data.LayoutScore ?? 97;
  const lastSynced = data.updatedAt
    ? new Date(data.updatedAt).toLocaleString()
    : "now";
  const cost = {
    equipmentCost: data.EquipmentCost,
    materialCost: data.MaterialCost,
    totalCost:
      (Number(data.EquipmentCost) || 0) +
      (Number(data.MaterialCost) || 0)
  };

  // --- Switcher navigation helpers ---
  // (If you want "next/prev" buttons, these use the actual available options)
  const modeIndex = data.availableModes.indexOf(mode);
  const zoneIndex = data.availableZones.indexOf(zone);
  const nextMode = () => setMode(data.availableModes[(modeIndex + 1) % data.availableModes.length]);
  const prevMode = () => setMode(data.availableModes[(modeIndex - 1 + data.availableModes.length) % data.availableModes.length]);
  const nextZone = () => setZone(data.availableZones[(zoneIndex + 1) % data.availableZones.length]);
  const prevZone = () => setZone(data.availableZones[(zoneIndex - 1 + data.availableZones.length) % data.availableZones.length]);

  // If you want to allow editing the project name:
  const setProjectName = () => {};

  return (
    <div
      className="relative bg-black text-white w-screen h-screen overflow-hidden"
      style={{ fontFamily: "'Roboto', 'system-ui', sans-serif" }}
    >
      <ViewportGrid />
      {/* 3D viewer embed - you can use embedUrl or your iframe directly */}
      <div>
      <center>
        <iframe classname="relative mx-auto" title="Speckle" src="https://app.speckle.systems/projects/4fbfe07d27/models/0fb53e3467#embed=%7B%22isEnabled%22%3Atrue%2C%22isTransparent%22%3Atrue%2C%22hideControls%22%3Atrue%2C%22hideSelectionInfo%22%3Atrue%2C%22disableModelLink%22%3Atrue%2C%22noScroll%22%3Atrue%2C%22manualLoad%22%3Atrue%7D" width="2048" height="1080" frameborder="0"></iframe>
      </center>
      </div>
      <ViewportOverlay />
      <HeaderRow
        projectName={data.projectName}
        facilityScore={facilityScore}
        lastSynced={lastSynced}
        setProjectName={setProjectName}
        commitCount={data.commitCount || 12}
      />
      <FloatingSwitchers
        mode={mode}
        zone={zone}
        setMode={setMode}
        setZone={setZone}
        modes={data.availableModes}
        zones={data.availableZones}
        nextMode={nextMode}
        prevMode={prevMode}
        nextZone={nextZone}
        prevZone={prevZone}
      />
      <CostPanel {...cost} />
      <VerticalMetrics metrics={metrics} />
    </div>
  );
}

import HeaderRow from "./components/HeaderRow";
import ViewportGrid from "./components/ViewportGrid";
import ViewportOverlay from "./components/ViewportOverlay";
import SpeckleViewer from "./components/SpeckleViewer";
import FloatingSwitchers from "./components/FloatingSwitchers";
import CostPanel from "./components/CostPanel";
import VerticalMetrics from "./components/VerticalMetrics";

// Get the Speckle embed URL from .env
const embedUrl = import.meta.env.VITE_SPECKLE_EMBED_URL || "";

export default function App() {
  // The rest of your modular hooks/data remain unchanged (useMockData, useSpeckleData, etc.)
  // e.g.:
  // const { projectName, ... } = useMockData();

  // Example static values for demonstration (replace with your data hooks as needed)
  const projectName = "Speckle Project Demo";
  const facilityScore = 97;
  const lastSynced = "now";
  const cost = { equipmentCost: 2.43, materialCost: 1.68, totalCost: 4.11 };
  const metrics = {
    clearance: 91, equipment: 157, circulation: 78,
    layoutScore: 87, euiScore: 42, estimatedWorkers: 320
  };
  const mode = "Workset – Assembly Line A";
  const zone = "Zone 1 – Staging";
  const setProjectName = () => {};
  const nextMode = () => {};
  const prevMode = () => {};
  const nextZone = () => {};
  const prevZone = () => {};

  return (
    <div className="relative bg-black text-white w-screen h-screen overflow-hidden" style={{fontFamily: "'Roboto', 'system-ui', sans-serif"}}>
      <ViewportGrid />
      <div className="absolute inset-0 z-10">
        <SpeckleViewer embedUrl={embedUrl} />
      </div>
      <ViewportOverlay />
      <HeaderRow
        projectName={projectName}
        facilityScore={facilityScore}
        lastSynced={lastSynced}
        setProjectName={setProjectName}
        commitCount={12}
      />
      <FloatingSwitchers
        mode={mode}
        zone={zone}
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

// Use only one data source at a time, swap as needed
// import useMockData from "./useMockData";
import useSpeckleData from "./useSpeckleData";

import HeaderRow from "./components/HeaderRow";
import ViewportGrid from "./components/ViewportGrid";
import ViewportOverlay from "./components/ViewportOverlay";
import SpeckleViewer from "./components/SpeckleViewer";
import FloatingSwitchers from "./components/FloatingSwitchers";
import CostPanel from "./components/CostPanel";
import VerticalMetrics from "./components/VerticalMetrics";

// Load IDs from env with fallback
const streamId = import.meta.env.VITE_SPECKLE_STREAM_ID || "default-stream-id";
const commitId = import.meta.env.VITE_SPECKLE_COMMIT_ID || undefined;

export default function App() {
  // Swap to useMockData if you want to dev offline:
  // const { projectName, updatedAt, commitCount, metrics, loading, error } = useMockData(streamId);
  const { projectName, updatedAt, commitCount, metrics, loading, error } = useSpeckleData(streamId);

  // (Optionally keep static mode/zone/fake costs for now)
  const mode = "Workset – Assembly Line A";
  const zone = "Zone 1 – Staging";
  const setProjectName = () => {};
  const nextMode = () => {};
  const prevMode = () => {};
  const nextZone = () => {};
  const prevZone = () => {};
  const cost = {
    equipmentCost: 2.43,
    materialCost: 1.68,
    totalCost: 4.11
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-black text-gray-300">
      Loading Speckle stream metadata...
    </div>
  );
  if (error) return (
    <div className="flex items-center justify-center h-screen bg-black text-red-400">
      Error loading stream: {error}
    </div>
  );

  return (
    <div className="relative bg-black text-white w-screen h-screen overflow-hidden" style={{fontFamily: "'Roboto', 'system-ui', sans-serif"}}>
      <ViewportGrid />
      <div className="absolute inset-0 z-10">
        <SpeckleViewer streamId={streamId} commitId={commitId} />
      </div>
      <ViewportOverlay />
      <HeaderRow
        projectName={projectName}
        facilityScore={metrics.layoutScore}
        lastSynced={updatedAt}
        setProjectName={setProjectName}
        commitCount={commitCount}
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

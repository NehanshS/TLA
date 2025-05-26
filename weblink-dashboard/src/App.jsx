import useMockData from "./useMockData";
import HeaderRow from "./components/HeaderRow";
import ViewportGrid from "./components/ViewportGrid";
import ViewportOverlay from "./components/ViewportOverlay";
import ModelViewportPlaceholder from "./components/ModelViewportPlaceholder";
import FloatingSwitchers from "./components/FloatingSwitchers";
import CostPanel from "./components/CostPanel";
import VerticalMetrics from "./components/VerticalMetrics";

export default function App() {
  const data = useMockData();

  return (
    <div className="relative bg-black text-white w-screen h-screen overflow-hidden" style={{fontFamily: "'Roboto', 'system-ui', sans-serif"}}>
      <ViewportGrid />
      <ViewportOverlay />
      <HeaderRow
        projectName={data.header.projectName}
        facilityScore={data.header.facilityScore}
        lastSynced={data.header.lastSynced}
      />
      <ModelViewportPlaceholder />
      <FloatingSwitchers
        mode={data.mode}
        zone={data.zone}
      />
      <CostPanel
        equipmentCost={data.cost.equipmentCost}
        materialCost={data.cost.materialCost}
        totalCost={data.cost.totalCost}
      />
      <VerticalMetrics metrics={data.metrics} />
    </div>
  );
}

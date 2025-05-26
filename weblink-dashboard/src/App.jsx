import useMockData from "./useMockData";
import HeaderRow from "./components/HeaderRow";
import ViewportGrid from "./components/ViewportGrid";
import ViewportOverlay from "./components/ViewportOverlay";
import ModelViewportPlaceholder from "./components/ModelViewportPlaceholder";
import FloatingSwitchers from "./components/FloatingSwitchers";
import CostPanel from "./components/CostPanel";
import VerticalMetrics from "./components/VerticalMetrics";

export default function App() {
  const { header, cost, metrics, mode, zone } = useMockData();

  return (
    <div className="relative bg-black text-white w-screen h-screen overflow-hidden" style={{fontFamily: "'Roboto', 'system-ui', sans-serif"}}>
      <ViewportGrid />
      <ViewportOverlay />
      <HeaderRow {...header} />
      <ModelViewportPlaceholder />
      <FloatingSwitchers mode={mode} zone={zone} />
      <CostPanel {...cost} />
      <VerticalMetrics metrics={metrics} />
    </div>
  );
}

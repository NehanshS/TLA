
import React, { useState } from "react";
import HeaderRow from "./components/HeaderRow";
import DonutChart from "./components/DonutChart";
import VerticalMetrics from "./components/VerticalMetrics";
import ViewportGrid from "./components/ViewportGrid";
import CostPanel from "./components/CostPanel";
import FloatingSwitchers from "./components/FloatingSwitchers";
import useSpeckleData from "./useSpeckleData";

export default function App() {
  const [mode, setMode] = useState("All");
  const [zone, setZone] = useState("All");
  const data = useSpeckleData({ mode, zone });

  if (data.loading)
    return <div style={{ padding: 40, fontSize: 22 }}>Loading...</div>;
  if (data.error)
    return (
      <div style={{ padding: 40, fontSize: 22, color: "red" }}>
        Error: {data.error}
      </div>
    );

  return (
    <div>
      <HeaderRow projectName={data.projectName} updatedAt={data.updatedAt} />
      <FloatingSwitchers
        mode={mode}
        setMode={setMode}
        modes={data.availableModes}
        zone={zone}
        setZone={setZone}
        zones={data.availableZones}
      />
      <div className="dashboard-grid">
        <div>
          <DonutChart label="EUI" value={data.EUI} />
          <DonutChart label="Circulation" value={data.Circulation} />
          <DonutChart label="Clearances Met" value={data.ClearancesMet} />
          <DonutChart label="Equipment Count" value={data.EquipmentCount} />
          <DonutChart label="Estimated Workers" value={data.EstimatedWorkers} />
          <DonutChart label="Layout Score" value={data.LayoutScore} />
          <DonutChart label="EUI Score" value={data.EUIScore} />
        </div>
        <CostPanel
          materialCost={data.MaterialCost}
          equipmentCost={data.EquipmentCost}
        />
        <ViewportGrid />
        <VerticalMetrics data={data} />
      </div>
    </div>
  );
}

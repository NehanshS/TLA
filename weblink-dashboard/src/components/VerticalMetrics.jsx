import DonutChart from "./DonutChart";

// Compose prop objects
export default function VerticalMetrics({ metrics }) {
  const donutConfigs = [
    { label: "Clearance", value: metrics.clearance, strokeColor: "#fff" },
    { label: "Equipment", value: metrics.equipment, strokeColor: "#a02b2b", maxValue: 300 },
    { label: "Circulation", value: metrics.circulation, strokeColor: "#b2b2b2" },
    { label: "Layout Score", value: metrics.layoutScore, strokeColor: "#e0e0e0" },
    { label: "EUI Score", value: metrics.euiScore, strokeColor: "#cc3642" },
    { label: "Est. Workers", value: metrics.estimatedWorkers, strokeColor: "#e94c1a", maxValue: 500 },
  ];

  return (
    <div className="vertical-metrics">
      {donutConfigs.map((props, idx) => (
        <DonutChart key={idx} {...props} />
      ))}
    </div>
  );
}

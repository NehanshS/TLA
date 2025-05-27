import DonutChart from "./DonutChart";

// Compose prop objects
export default function VerticalMetrics({ metrics }) {
  const donutConfigs = [
    {
      label: "Clearance",
      value: metrics.clearance,
      maxValue: 100,
      index: 0,
    },
    {
      label: "Equipment",
      value: metrics.equipment,
      maxValue: 300,
      index: 1,
    },
    {
      label: "Circulation",
      value: metrics.circulation,
      maxValue: 100,
      index: 2,
    },
    {
      label: "Layout Score",
      value: metrics.layoutScore,
      maxValue: 100,
      index: 3,
    },
    {
      label: "EUI Score",
      value: metrics.euiScore,
      maxValue: 100,
      index: 4,
    },
    {
      label: "Estimated Workers",
      value: metrics.estimatedWorkers,
      maxValue: 500,
      index: 5,
    },
  ];

  return (
    <div className="vertical-metrics">
      {donutConfigs.map((props, idx) => (
        <DonutChart key={props.label} {...props} />
      ))}
    </div>
  );
}

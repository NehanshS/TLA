import DonutChart from "./DonutChart";

// Metrics order and details for the six donut charts
const donutSpecs = [
  { key: "clearance", label: "Clearance", fgClass: "donut-fg-clear", format: v => `${v}%` },
  { key: "equipment", label: "Equipment", fgClass: "donut-fg-equip", format: v => v },
  { key: "circulation", label: "Circulation", fgClass: "donut-fg-circ", format: v => `${v}%` },
  { key: "layoutScore", label: "Layout Score", fgClass: "donut-fg-layout", format: v => v },
  { key: "euiScore", label: "EUI Score", fgClass: "donut-fg-eui", format: v => v },
  { key: "estimatedWorkers", label: "Est. Workers", fgClass: "donut-fg-workers", format: v => v },
];

const dashArrayMap = {
  clearance: "139,34",
  equipment: "113,59",
  circulation: "97,78",
  layoutScore: "110,61",
  euiScore: "127,45",
  estimatedWorkers: "97,40"
};

export default function VerticalMetrics({ metrics }) {
  return (
    <div className="vertical-metrics">
      {donutSpecs.map((spec, i) => (
        <div key={i} className="flex flex-col items-center px-1">
          <DonutChart
            value={spec.format(metrics[spec.key])}
            fgClass={spec.fgClass}
            dashArray={dashArrayMap[spec.key]}
          />
          <span
            className="acumin-thin text-[0.64rem] font-light text-gray-300 mt-0.5 tracking-tight"
            style={{ letterSpacing: "0.08em" }}
          >
            {spec.label}
          </span>
        </div>
      ))}
    </div>
  );
}

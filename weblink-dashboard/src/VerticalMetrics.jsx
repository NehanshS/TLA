import DonutChart from "./DonutChart";

const metrics = [
  {
    value: "91%",
    label: "Clearance",
    fgClass: "donut-fg-clear",
    dashArray: "139,34",
  },
  {
    value: "157",
    label: "Equipment",
    fgClass: "donut-fg-equip",
    dashArray: "113,59",
  },
  {
    value: "78%",
    label: "Circulation",
    fgClass: "donut-fg-circ",
    dashArray: "97,78",
  },
  {
    value: "87",
    label: "Layout Score",
    fgClass: "donut-fg-layout",
    dashArray: "110,61",
  },
  {
    value: "42",
    label: "EUI Score",
    fgClass: "donut-fg-eui",
    dashArray: "127,45",
  },
  {
    value: "320",
    label: "Est. Workers",
    fgClass: "donut-fg-workers",
    dashArray: "97,40",
  },
];

export default function VerticalMetrics() {
  return (
    <div className="vertical-metrics">
      {metrics.map((m, i) => (
        <div key={i} className="flex flex-col items-center px-1">
          <DonutChart {...m} />
          <span
            className="acumin-thin text-[0.64rem] font-light text-gray-300 mt-0.5 tracking-tight"
            style={{ letterSpacing: "0.08em" }}
          >
            {m.label}
          </span>
        </div>
      ))}
    </div>
  );
}
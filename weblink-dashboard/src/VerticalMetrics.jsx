import DonutMetric from './DonutMetric';

export default function VerticalMetrics() {
  // The donut order and values match your HTML
  const donuts = [
    { value: "91%", label: "Clearance", dash: "139,34", fgClass: "donut-fg-clear" },
    { value: "157",  label: "Equipment", dash: "113,59", fgClass: "donut-fg-equip" },
    { value: "78%",  label: "Circulation", dash: "97,78", fgClass: "donut-fg-circ" },
    { value: "87",   label: "Layout Score", dash: "110,61", fgClass: "donut-fg-layout" },
    { value: "42",   label: "EUI Score", dash: "127,45", fgClass: "donut-fg-eui" },
    { value: "320",  label: "Est. Workers", dash: "97,40", fgClass: "donut-fg-workers" },
  ];

  return (
    <div className="vertical-metrics">
      {donuts.map((d, i) => (
        <DonutMetric key={i} {...d} />
      ))}
    </div>
  );
}
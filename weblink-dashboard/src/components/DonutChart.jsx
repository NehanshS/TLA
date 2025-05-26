export default function DonutChart({ value, fgClass, dashArray }) {
  return (
    <svg className={`donut-metric donut-sm`} viewBox="0 0 61.44 61.44">
      <circle className="donut-bg" cx="30.72" cy="30.72" r="24.96" fill="none" />
      <circle className={fgClass} cx="30.72" cy="30.72" r="24.96" fill="none" strokeDasharray={dashArray} />
      <text className="value" x="50%" y="54%" textAnchor="middle" dy=".3em" style={{fontWeight:500}}>
        {value}
      </text>
    </svg>
  );
}

export default function DonutMetric({ value, label, dash, fgClass }) {
  return (
    <div className="flex flex-col items-center px-1">
      <svg className="donut-metric donut-sm" viewBox="0 0 61.44 61.44">
        <circle className="donut-bg" cx="30.72" cy="30.72" r="24.96" fill="none" />
        <circle className={fgClass} cx="30.72" cy="30.72" r="24.96" fill="none" strokeDasharray={dash} />
        <text className="value" x="50%" y="54%" textAnchor="middle" dy=".3em" style={{ fontWeight: 500 }}>{value}</text>
      </svg>
      <span className="acumin-thin text-[0.64rem] font-light text-gray-300 mt-0.5 tracking-tight" style={{ letterSpacing: "0.08em" }}>
        {label}
      </span>
    </div>
  );
}
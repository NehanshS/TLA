import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

// Tesla-inspired reds/whites for 6 core metrics
const METRIC_COLORS = [
  "#e94545", // Red 1
  "#a02b2b", // Red 2
  "#fff",    // White
  "#d13333", // Red 3
  "#f2f2f2", // White 2
  "#cc3642", // Red 4
];

// Optional: consistent mapping for label names
const COLOR_BY_LABEL = {
  Clearance: "#e94545",
  Equipment: "#a02b2b",
  Circulation: "#fff",
  "Layout Score": "#d13333",
  "EUI Score": "#cc3642",
  "Estimated Workers": "#f2f2f2"
};

function getColor(label, idx) {
  if (label && COLOR_BY_LABEL[label]) return COLOR_BY_LABEL[label];
  if (idx != null && METRIC_COLORS[idx % METRIC_COLORS.length]) return METRIC_COLORS[idx % METRIC_COLORS.length];
  return "#e94545";
}

export default function DonutChart({ value, label, maxValue = 100, index }) {
  // Defensive: fallback for missing or bad value
  const displayValue =
    value == null || isNaN(value) ? "--" : Number(value).toLocaleString();

  // Dimensions
  const size = 61.44;
  const strokeWidth = 2.8;
  const radius = (size / 2) - (strokeWidth / 2);
  const circumference = 2 * Math.PI * radius;
  const percent =
    value == null || isNaN(value)
      ? 0
      : Math.max(0, Math.min(1, value / maxValue));
  const dash = percent * circumference;

  // Framer motion for smooth animation
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ strokeDasharray: `${dash},${circumference - dash}` });
  }, [dash, circumference, controls]);

  // Assign color by label or index
  const strokeColor = getColor(label, index);

  return (
    <div className="flex flex-col items-center px-1">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ display: "block" }}
        className="donut-metric donut-sm"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#18181b"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="butt"
          initial={false}
          animate={controls}
          strokeDasharray={`${dash},${circumference - dash}`}
          style={{ transition: "stroke-dasharray 0.9s cubic-bezier(.4,2,.4,1)" }}
        />
        <text
          x="50%"
          y="54%"
          textAnchor="middle"
          dy=".3em"
          style={{
            fontFamily: "'Roboto', 'Arial', sans-serif",
            fontSize: "0.87em",
            fontWeight: 500,
            fill: "#fff",
            letterSpacing: "0.01em"
          }}
        >
          {displayValue}
        </text>
      </svg>
      <span
        className="acumin-thin text-[0.64rem] font-light text-gray-300 mt-0.5 tracking-tight"
        style={{ letterSpacing: "0.08em" }}
      >
        {label}
      </span>
    </div>
  );
}

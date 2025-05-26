import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

export default function DonutChart({ value, label, maxValue = 100, strokeColor }) {
  // Dimensions
  const size = 61.44;
  const strokeWidth = 2.8;
  const radius = (size / 2) - (strokeWidth / 2);
  const circumference = 2 * Math.PI * radius;
  const percent = Math.max(0, Math.min(1, value / maxValue));
  const dash = percent * circumference;

  // Framer motion for smooth animation
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ strokeDasharray: `${dash},${circumference - dash}` });
  }, [dash, circumference, controls]);

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
          cx={size/2}
          cy={size/2}
          r={radius}
          fill="none"
          stroke="#18181b"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size/2}
          cy={size/2}
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
          {value}
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


import React from "react";

export default function FloatingSwitchers({
  mode,
  setMode,
  modes,
  zone,
  setZone,
  zones
}) {
  return (
    <div className="floating-switchers">
      <label>
        Mode:
        <select value={mode} onChange={e => setMode(e.target.value)}>
          {modes.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </label>
      <label>
        Project Zone:
        <select value={zone} onChange={e => setZone(e.target.value)}>
          {zones.map(z => (
            <option key={z} value={z}>{z}</option>
          ))}
        </select>
      </label>
    </div>
  );
}

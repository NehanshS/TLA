import React from "react";

export default function FloatingSwitchers({
  mode,
  setMode,
  modes = ["All"],
  zone,
  setZone,
  zones = ["All"],
  nextMode,
  prevMode,
  nextZone,
  prevZone
}) {
  return (
    <div className="floating-switchers">
      {/* MODE SWITCHER */}
      <div className="mode-changer">
        <button
          aria-label="Previous Mode"
          onClick={prevMode}
          type="button"
          tabIndex={0}
        >
          ◀
        </button>
        <label htmlFor="mode-select" style={{ marginRight: 4 }}>Mode</label>
        <select
          id="mode-select"
          value={mode}
          onChange={e => setMode(e.target.value)}
          className="bg-black border-none rounded text-white px-2 py-1"
          style={{ minWidth: 120 }}
        >
          {modes.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <button
          aria-label="Next Mode"
          onClick={nextMode}
          type="button"
          tabIndex={0}
        >
          ▶
        </button>
      </div>

      {/* ZONE SWITCHER */}
      <div className="zone-changer">
        <button
          aria-label="Previous Zone"
          onClick={prevZone}
          type="button"
          tabIndex={0}
        >
          ◀
        </button>
        <label htmlFor="zone-select" style={{ marginRight: 4 }}>Zone</label>
        <select
          id="zone-select"
          value={zone}
          onChange={e => setZone(e.target.value)}
          className="bg-black border-none rounded text-white px-2 py-1"
          style={{ minWidth: 120 }}
        >
          {zones.map((z) => (
            <option key={z} value={z}>{z}</option>
          ))}
        </select>
        <button
          aria-label="Next Zone"
          onClick={nextZone}
          type="button"
          tabIndex={0}
        >
          ▶
        </button>
      </div>
    </div>
  );
}

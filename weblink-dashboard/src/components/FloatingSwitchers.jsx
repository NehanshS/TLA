export default function FloatingSwitchers({ mode, zone, nextMode, prevMode, nextZone, prevZone }) {
  return (
    <div className="floating-dashboard-content" style={{alignItems: "flex-start", left: "2vw", width: "auto"}}>
      <div className="mode-changer acumin-thin text-xs">
        <button aria-label="Previous mode" onClick={prevMode}>&lt;</button>
        <span className="mx-2 text-xs acumin-thin italic">
          Mode: <span className="text-white font-semibold not-italic">{mode}</span>
        </span>
        <button aria-label="Next mode" onClick={nextMode}>&gt;</button>
      </div>
      <div className="zone-changer acumin-thin text-xs">
        <button aria-label="Previous zone" onClick={prevZone}>&lt;</button>
        <span className="mx-2 text-xs acumin-thin italic">
          Project Zone: <span className="text-white font-semibold not-italic">{zone}</span>
        </span>
        <button aria-label="Next zone" onClick={nextZone}>&gt;</button>
      </div>
    </div>
  );
}

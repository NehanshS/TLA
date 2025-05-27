export default function HeaderRow({
  projectName,
  facilityScore,
  lastSynced,
  setProjectName, // can be a no-op if read-only
}) {
  return (
    <div className="header-row">
      <div className="header-left-col" style={{ marginTop: 0 }}>
        <div className="project-title acumin-thin">
          PROJECT:{" "}
          {typeof setProjectName === "function" ? (
            <input
              className="bg-transparent border-b border-gray-700 focus:outline-none text-white"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              style={{ width: "17em", fontWeight: 300 }}
              aria-label="Project Name"
              spellCheck={false}
            />
          ) : (
            <span>{projectName}</span>
          )}
        </div>
        <div className="facility-score-top roboto-bold">
          {facilityScore == null || isNaN(facilityScore)
            ? "--"
            : Number(facilityScore).toLocaleString()}
        </div>
        <div className="facility-label-top acumin-thin">
          Facility Score
        </div>
      </div>
      <div className="header-metrics">
        <div className="last-synced acumin-thin">
          Last Synced: {lastSynced || "--"}
        </div>
      </div>
    </div>
  );
}

export default function HeaderRow({ projectName, facilityScore, lastSynced }) {
  return (
    <div className="header-row">
      <div className="header-left-col" style={{marginTop: 0}}>
        <div className="project-title acumin-thin">PROJECT: {projectName}</div>
        <div className="facility-score-top roboto-bold">{facilityScore}</div>
        <div className="facility-label-top acumin-thin">Facility Score</div>
      </div>
      <div className="header-metrics">
        <div className="last-synced acumin-thin">Last Synced: {lastSynced}</div>
      </div>
    </div>
  );
}

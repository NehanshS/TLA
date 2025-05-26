export default function HeaderRow() {
  return (
    <div className="header-row">
      <div className="header-left-col" style={{marginTop: 0}}>
        <div className="project-title acumin-thin">PROJECT: Gigafactory Austin – North Wing</div>
        <div className="facility-score-top roboto-bold">97</div>
        <div className="facility-label-top acumin-thin">Facility Score</div>
      </div>
      <div className="header-metrics">
        <div className="last-synced acumin-thin">Last Synced: &lt;2 minutes ago&gt;</div>
      </div>
    </div>
  );
}
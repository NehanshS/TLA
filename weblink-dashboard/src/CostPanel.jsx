export default function CostPanel() {
  return (
    <div className="cost-panel">
      <div className="cost-breakdown">
        <span>
          <span className="cost-break-label">Equipment Cost</span>
          <span className="cost-break-value">$2.43M</span>
        </span>
        <span>
          <span className="cost-break-label">Material Cost</span>
          <span className="cost-break-value">$1.68M</span>
        </span>
      </div>
      <div className="cost-score roboto-bold">$4.35M</div>
      <div className="cost-label acumin-thin">Preliminary Cost Estimate</div>
    </div>
  );
}
export default function CostPanel({ equipmentCost, materialCost, totalCost }) {
  return (
    <div className="cost-panel">
      <div className="cost-breakdown">
        <span>
          <span className="cost-break-label">Equipment Cost</span>
          <span className="cost-break-value">${equipmentCost.toLocaleString()}M</span>
        </span>
        <span>
          <span className="cost-break-label">Material Cost</span>
          <span className="cost-break-value">${materialCost.toLocaleString()}M</span>
        </span>
      </div>
      <div className="cost-score roboto-bold">${totalCost.toLocaleString()}M</div>
      <div className="cost-label acumin-thin">Preliminary Cost Estimate</div>
    </div>
  );
}

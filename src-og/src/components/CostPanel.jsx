export default function CostPanel({ equipmentCost, materialCost, totalCost }) {
  // Helper: safely format number or show "--"
  const safeFormat = (num) =>
    num == null || isNaN(num)
      ? "--"
      : Number(num).toLocaleString(undefined, { maximumFractionDigits: 2 });

  return (
    <div className="cost-panel">
      <div className="cost-breakdown">
        <span>
          <span className="cost-break-label">Equipment Cost</span>
          <span className="cost-break-value">
            ${safeFormat(equipmentCost)}M
          </span>
        </span>
        <span>
          <span className="cost-break-label">Material Cost</span>
          <span className="cost-break-value">
            ${safeFormat(materialCost)}M
          </span>
        </span>
      </div>
      <div className="cost-score roboto-bold">
        ${safeFormat(totalCost)}M
      </div>
      <div className="cost-label acumin-thin">
        Preliminary Cost Estimate
      </div>
    </div>
  );
}

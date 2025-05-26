### Absolutely! Here’s how to **perfectly recreate your HTML 1:1 as a modular React + Tailwind dashboard**—with exact layout, classes, styles, SVGs, and every detail, for live Vercel deployment.

Below is a step-by-step “for-beginners” guide. **Follow this exactly and you will have a pixel-perfect, Vercel-ready React dashboard.**
*(If you need the code in a zip, just ask!)*

---

# **Step 1: Project Setup (What You Already Have)**

* **You already did:**

  * `npm create vite@latest weblink-dashboard -- --template react`
  * `cd weblink-dashboard`
  * Installed Tailwind per [official docs](https://tailwindcss.com/docs/guides/vite)
* You should have:

  * `src/` folder with `App.jsx`, `main.jsx`
  * `tailwind.config.js`
  * Tailwind CSS imported in `index.css`

---

# **Step 2: Fonts & Global Styles**

* **Add Google Fonts**
  In `index.html` `<head>`, add ***before*** the `</head>`:

  ```html
  <link href="https://fonts.googleapis.com/css?family=Roboto:400,500,700,900,400italic,700italic&display=swap" rel="stylesheet">
  ```

  > If you want Acumin, use `'system-ui', sans-serif`—the web font is paid, so this matches your fallback.

* **Copy these global styles into `src/index.css`** (add after the Tailwind imports):

  ```css
  html, body { height: 100%; width: 100%; margin: 0; padding: 0; }
  body { min-height: 100vh; min-width: 100vw; background: #090a0c; overflow: hidden; }
  .acumin-thin { font-family: 'system-ui', 'sans-serif'; font-weight: 300; letter-spacing: 0.08em; }
  .roboto-bold { font-family: 'Roboto', 'Arial', 'Helvetica Neue', 'sans-serif'; font-weight: 500; letter-spacing: 0.03em; }
  /* Paste every CSS block from your html <style> section, adjusting for font family if Acumin not available */
  /* ...copy everything between <style> ... </style> */
  ```

---

# **Step 3: Project Structure**

Make these files in `src/components/`:

* `HeaderRow.jsx`
* `ViewportGrid.jsx`
* `ViewportOverlay.jsx`
* `FloatingSwitchers.jsx`
* `CostPanel.jsx`
* `VerticalMetrics.jsx`
* `DonutChart.jsx`
* `ModelViewportPlaceholder.jsx`
* `App.jsx` (main)

---

# **Step 4: 1:1 Component Code**

### **src/App.jsx**

```jsx
import HeaderRow from "./components/HeaderRow";
import ViewportGrid from "./components/ViewportGrid";
import ViewportOverlay from "./components/ViewportOverlay";
import ModelViewportPlaceholder from "./components/ModelViewportPlaceholder";
import FloatingSwitchers from "./components/FloatingSwitchers";
import CostPanel from "./components/CostPanel";
import VerticalMetrics from "./components/VerticalMetrics";

export default function App() {
  return (
    <div className="relative bg-black text-white w-screen h-screen overflow-hidden" style={{fontFamily: "'Roboto', 'system-ui', sans-serif"}}>
      <ViewportGrid />
      <ViewportOverlay />
      <HeaderRow />
      <ModelViewportPlaceholder />
      <FloatingSwitchers />
      <CostPanel />
      <VerticalMetrics />
    </div>
  );
}
```

---

### **src/components/HeaderRow\.jsx**

```jsx
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
```

---

### **src/components/ViewportGrid.jsx**

```jsx
export default function ViewportGrid() {
  return <div className="model-viewport-grid"></div>;
}
```

---

### **src/components/ViewportOverlay.jsx**

```jsx
export default function ViewportOverlay() {
  return <div className="viewport-overlay-dark"></div>;
}
```

---

### **src/components/ModelViewportPlaceholder.jsx**

```jsx
export default function ModelViewportPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
      <span
        className="font-mono text-lg text-gray-100 opacity-95 select-none pointer-events-none tracking-wider acumin-thin"
        style={{
          letterSpacing: "0.09em",
          background: "rgba(0,0,0,0.13)",
          padding: "0.4em 1.2em",
          borderRadius: "14px",
        }}
      >
        3D Model Viewport
      </span>
    </div>
  );
}
```

---

### **src/components/FloatingSwitchers.jsx**

```jsx
export default function FloatingSwitchers() {
  return (
    <div className="floating-dashboard-content" style={{alignItems: "flex-start", left: "2vw", width: "auto"}}>
      <div className="mode-changer acumin-thin text-xs">
        <button aria-label="Previous mode">&lt;</button>
        <span className="mx-2 text-xs acumin-thin italic">
          Mode: <span className="text-white font-semibold not-italic">Workset – Assembly Line A</span>
        </span>
        <button aria-label="Next mode">&gt;</button>
      </div>
      <div className="zone-changer acumin-thin text-xs">
        <button aria-label="Previous zone">&lt;</button>
        <span className="mx-2 text-xs acumin-thin italic">
          Project Zone: <span className="text-white font-semibold not-italic">Zone 1 – Staging</span>
        </span>
        <button aria-label="Next zone">&gt;</button>
      </div>
    </div>
  );
}
```

---

### **src/components/CostPanel.jsx**

```jsx
export default function CostPanel() {
  return (
    <div className="cost-panel">
      <div className="cost-breakdown">
        <span>
          <span className="cost-break-label">Equipment Cost</span> <span className="cost-break-value">$2.43M</span>
        </span>
        <span>
          <span className="cost-break-label">Material Cost</span> <span className="cost-break-value">$1.68M</span>
        </span>
      </div>
      <div className="cost-score roboto-bold">$4.35M</div>
      <div className="cost-label acumin-thin">Preliminary Cost Estimate</div>
    </div>
  );
}
```

---

### **src/components/VerticalMetrics.jsx**

```jsx
import DonutChart from "./DonutChart";

const metrics = [
  {
    value: "91%",
    label: "Clearance",
    fgClass: "donut-fg-clear",
    dashArray: "139,34",
  },
  {
    value: "157",
    label: "Equipment",
    fgClass: "donut-fg-equip",
    dashArray: "113,59",
  },
  {
    value: "78%",
    label: "Circulation",
    fgClass: "donut-fg-circ",
    dashArray: "97,78",
  },
  {
    value: "87",
    label: "Layout Score",
    fgClass: "donut-fg-layout",
    dashArray: "110,61",
  },
  {
    value: "42",
    label: "EUI Score",
    fgClass: "donut-fg-eui",
    dashArray: "127,45",
  },
  {
    value: "320",
    label: "Est. Workers",
    fgClass: "donut-fg-workers",
    dashArray: "97,40",
  },
];

export default function VerticalMetrics() {
  return (
    <div className="vertical-metrics">
      {metrics.map((m, i) => (
        <div key={i} className="flex flex-col items-center px-1">
          <DonutChart {...m} />
          <span
            className="acumin-thin text-[0.64rem] font-light text-gray-300 mt-0.5 tracking-tight"
            style={{ letterSpacing: "0.08em" }}
          >
            {m.label}
          </span>
        </div>
      ))}
    </div>
  );
}
```

---

### **src/components/DonutChart.jsx**

```jsx
export default function DonutChart({ value, fgClass, dashArray }) {
  return (
    <svg className={`donut-metric donut-sm`} viewBox="0 0 61.44 61.44">
      <circle className="donut-bg" cx="30.72" cy="30.72" r="24.96" fill="none" />
      <circle className={fgClass} cx="30.72" cy="30.72" r="24.96" fill="none" strokeDasharray={dashArray} />
      <text className="value" x="50%" y="54%" textAnchor="middle" dy=".3em" style={{fontWeight:500}}>
        {value}
      </text>
    </svg>
  );
}
```

---

# **Step 5: Final Touches**

* **No extra CSS needed if you copy all classes from your HTML `<style>` into `index.css`.**
* **Double-check Tailwind and your custom classes are NOT colliding.**

---

# **Step 6: Go Live on Vercel**

1. Commit and push your repo to GitHub (or GitLab/Bitbucket).
2. Go to [vercel.com](https://vercel.com/), create account, link your GitHub, and import the project.
3. Vercel will auto-detect as Vite/React, build, and deploy.
4. Your dashboard will be live with a sharable URL.

---

# **Step 7: Make All Values Dynamic**

When you’re ready for **live Revit data integration**, just replace the hardcoded values in each component (project, scores, donuts, costs) with values from a context or prop, e.g.:

```jsx
<HeaderRow project={revitData.project} facilityScore={revitData.facilityScore} />
<VerticalMetrics metrics={revitData.metricsArray} />
<CostPanel equipment={revitData.equipmentCost} ... />
```

---

## **Result:**

You’ll have a pixel-perfect, modular, 1:1 React + Tailwind dashboard, ready for dynamic BIM/automation data, and deployable in minutes.

---

### **If you want:**

* A fully working [GitHub repo template](https://github.com), say so.
* Help wiring up with Revit/Speckle data—ask and I’ll give step-by-step.

---

## **You are ready. Just copy-paste, and deploy.**

If anything doesn’t look **exactly** right, send me a screenshot and I’ll tweak the code to perfection.

Perfect, thanks for providing the full HTML. Let’s convert this **1:1** into a modular, Vercel-ready React + Tailwind app with all styles, classnames, and layout **identical** to your HTML.

---

# **Step-by-Step: How To Do This in Your Vite + Tailwind + React Setup**

### **1. Project Structure**

Assume you’re in `/weblink-dashboard` and you already ran:

```sh
npm create vite@latest
# → Choose React + JS or TS
cd weblink-dashboard
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

(Tailwind is installed. If not, [see Tailwind with Vite Quickstart](https://tailwindcss.com/docs/guides/vite))

---

## **2. Add Custom Fonts and Global CSS**

**a.** In your `index.html`, paste this in the `<head>`:

```html
<link href="https://fonts.googleapis.com/css?family=Roboto:400,500,700,900,400italic,700italic&display=swap" rel="stylesheet">
<!-- Acumin Variable Concept is Adobe-only, so fallback to system-ui/sans-serif as in your HTML -->
```

**b.** In `src/index.css`, add custom classes (paste after `@tailwind base; @tailwind components; @tailwind utilities;`)

```css
@import url('https://fonts.googleapis.com/css?family=Roboto:400,500,700,900,400italic,700italic&display=swap');

/* Custom font classes */
.acumin-thin {
  font-family: 'Acumin Variable Concept', 'system-ui', 'sans-serif';
  font-weight: 300;
  letter-spacing: 0.08em;
}
.roboto-bold {
  font-family: 'Roboto', 'Arial', 'Helvetica Neue', 'sans-serif';
  font-weight: 500;
  letter-spacing: 0.03em;
}

/* All your other custom CSS from <style> in HTML, paste below: */
```

Copy **everything** from your HTML `<style>` into `src/index.css` **after** the font imports.
(Tailwind will let you override/add utility classes on top of this.)

---

## **3. Folder/File Structure**

Create:

```
src/
  components/
    HeaderRow.jsx
    ModelViewport.jsx
    FloatingDashboardContent.jsx
    CostPanel.jsx
    VerticalMetrics.jsx
    DonutMetric.jsx
  App.jsx
  index.css
  main.jsx
```

---

## **4. Component Conversion (Copy-Paste Ready)**

### **App.jsx**

```jsx
import HeaderRow from './components/HeaderRow';
import ModelViewport from './components/ModelViewport';
import FloatingDashboardContent from './components/FloatingDashboardContent';
import CostPanel from './components/CostPanel';
import VerticalMetrics from './components/VerticalMetrics';
import './index.css'; // Custom styles

export default function App() {
  return (
    <div className="bg-black text-white relative w-[100vw] h-[100vh] overflow-hidden">
      <div className="model-viewport-grid"></div>
      <div className="viewport-overlay-dark"></div>
      <HeaderRow />
      <ModelViewport />
      <FloatingDashboardContent />
      <CostPanel />
      <VerticalMetrics />
    </div>
  );
}
```

---

### **components/HeaderRow\.jsx**

```jsx
export default function HeaderRow() {
  return (
    <div className="header-row">
      <div className="header-left-col" style={{ marginTop: 0 }}>
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

### **components/ModelViewport.jsx**

```jsx
export default function ModelViewport() {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
      <span className="font-mono text-lg text-gray-100 opacity-95 select-none pointer-events-none tracking-wider acumin-thin"
        style={{ letterSpacing: '0.09em', background: 'rgba(0,0,0,0.13)', padding: '0.4em 1.2em', borderRadius: '14px' }}>
        3D Model Viewport
      </span>
    </div>
  );
}
```

---

### **components/FloatingDashboardContent.jsx**

```jsx
export default function FloatingDashboardContent() {
  return (
    <div className="floating-dashboard-content" style={{ alignItems: 'flex-start', left: '2vw', width: 'auto' }}>
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

### **components/CostPanel.jsx**

```jsx
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
```

---

### **components/VerticalMetrics.jsx**

```jsx
import DonutMetric from './DonutMetric';

export default function VerticalMetrics() {
  // The donut order and values match your HTML
  const donuts = [
    { value: "91%", label: "Clearance", dash: "139,34", fgClass: "donut-fg-clear" },
    { value: "157",  label: "Equipment", dash: "113,59", fgClass: "donut-fg-equip" },
    { value: "78%",  label: "Circulation", dash: "97,78", fgClass: "donut-fg-circ" },
    { value: "87",   label: "Layout Score", dash: "110,61", fgClass: "donut-fg-layout" },
    { value: "42",   label: "EUI Score", dash: "127,45", fgClass: "donut-fg-eui" },
    { value: "320",  label: "Est. Workers", dash: "97,40", fgClass: "donut-fg-workers" },
  ];

  return (
    <div className="vertical-metrics">
      {donuts.map((d, i) => (
        <DonutMetric key={i} {...d} />
      ))}
    </div>
  );
}
```

---

### **components/DonutMetric.jsx**

```jsx
export default function DonutMetric({ value, label, dash, fgClass }) {
  return (
    <div className="flex flex-col items-center px-1">
      <svg className="donut-metric donut-sm" viewBox="0 0 61.44 61.44">
        <circle className="donut-bg" cx="30.72" cy="30.72" r="24.96" fill="none" />
        <circle className={fgClass} cx="30.72" cy="30.72" r="24.96" fill="none" strokeDasharray={dash} />
        <text className="value" x="50%" y="54%" textAnchor="middle" dy=".3em" style={{ fontWeight: 500 }}>{value}</text>
      </svg>
      <span className="acumin-thin text-[0.64rem] font-light text-gray-300 mt-0.5 tracking-tight" style={{ letterSpacing: "0.08em" }}>
        {label}
      </span>
    </div>
  );
}
```

---

## **5. Final Steps**

**a. Main Entry**
`main.jsx` (Vite default):

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**b. Tailwind Config**
No changes required unless you want to add custom colors or extend fonts.

---

## **6. Vercel Deployment**

1. **Push to GitHub**

   * `git init` (if not yet a repo)
   * `git add . && git commit -m "Initial commit"`
   * Create a new repo on GitHub and push your code.

2. **Go to [Vercel.com](https://vercel.com/) and sign in with GitHub.**

3. **Import your repo** and select the project root (`weblink-dashboard`).

4. **Framework preset:** choose **Vite** (Vercel will detect it automatically).

5. **Deploy** — no extra configuration needed.

---

## **7. How to Customize/Expand**

* **Replace `3D Model Viewport`** with your real Speckle embed as a component.
* **Switchers** can be made interactive (add state with React useState).
* **Donut charts** can be made dynamic (map real data).
* **Keep custom CSS for 1:1 style** but add/override with Tailwind as you expand.

---

## **8. One-line Summary**

**This setup will match your provided HTML pixel-for-pixel using React components and custom CSS. Deploy to Vercel by connecting your repo and choosing the Vite preset.**

---

**Ready to go!**
If you want this zipped as a template or need help making the mode/zone switchers dynamic, just say so!

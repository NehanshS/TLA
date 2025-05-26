Absolutely! This is the best practice for future-proofing.
You want a **`useSpeckleData.js`** hook that returns the **exact same structure** as `useMockData`, so your UI works no matter which hook you swap in.

---

## **Step 1: Create `useSpeckleData.js`**

**In your `src/` folder, create a new file:**

```
src/useSpeckleData.js
```

**Paste this template:**

```jsx
import { useState } from "react";

// These lists should match your app's logic
const modeList = [
  "Workset – Assembly Line A",
  "Planning – Logistics",
  "Review – QA",
];
const zoneList = [
  "Zone 1 – Staging",
  "Zone 2 – Material Handling",
  "Zone 3 – Final Assembly",
];

export default function useSpeckleData() {
  // --- Project, Modes, Zones
  const [projectName, setProjectName] = useState("Gigafactory Austin – North Wing");
  const [modeIdx, setModeIdx] = useState(0);
  const [zoneIdx, setZoneIdx] = useState(0);

  // --- Static data (update with live Speckle data later)
  const [data] = useState({
    header: {
      facilityScore: 97,
      lastSynced: "just now",
    },
    cost: {
      equipmentCost: 2.43,
      materialCost: 1.68,
      totalCost: 4.11,
    },
    metrics: {
      clearance: 91,
      equipment: 157,
      circulation: 78,
      layoutScore: 87,
      euiScore: 42,
      estimatedWorkers: 320,
    }
  });

  // Functions for switching modes/zones
  const nextMode = () => setModeIdx(i => (i + 1) % modeList.length);
  const prevMode = () => setModeIdx(i => (i - 1 + modeList.length) % modeList.length);
  const nextZone = () => setZoneIdx(i => (i + 1) % zoneList.length);
  const prevZone = () => setZoneIdx(i => (i - 1 + zoneList.length) % zoneList.length);

  return {
    header: {
      ...data.header,
      projectName,
      setProjectName,
    },
    cost: data.cost,
    metrics: data.metrics,
    mode: modeList[modeIdx],
    zone: zoneList[zoneIdx],
    modes: modeList,
    zones: zoneList,
    setProjectName,
    nextMode,
    prevMode,
    nextZone,
    prevZone,
  };
}
```

---

## **Step 2: How to use it**

In `App.jsx`, simply change:

```jsx
import useMockData from "./useMockData";
```

**to**

```jsx
import useSpeckleData from "./useSpeckleData";
```

and then:

```jsx
const {
  header, cost, metrics,
  mode, zone, modes, zones,
  setProjectName, nextMode, prevMode, nextZone, prevZone
} = useSpeckleData();
```

*(Or use destructuring exactly as before.)*

---

## **Step 3: Integrating Live Data Later**

* You can update `useSpeckleData`’s state either with a polling function, event listener, or async fetch from the Speckle SDK.
* The UI and all components **will work unchanged** as long as the return object matches the same shape.

---

## **You are future-proofed and modular!**

If you want a "hot-swap" selector (dev toggle) for switching between mock and live data, let me know and I’ll give you the code.
When you’re ready to pull data from Speckle, just update the values inside `useSpeckleData.js`.

Let me know when you want to connect the SDK or wire up live listeners!


You'll see your project live at http://localhost:5173.

PS D:\New folder\OneDrive - Cal Poly\Documents\GitHub\TLA\weblink-dashboard> npm install @speckle/viewer @speckle/sdk
npm error code E404
npm error 404 Not Found - GET https://registry.npmjs.org/@speckle%2fsdk - Not found
npm error 404
npm error 404  '@speckle/sdk@*' is not in this registry.
npm error 404
npm error 404 Note that you can also install from a
npm error 404 tarball, folder, http url, or git url.
npm error A complete log of this run can be found in: C:\Users\nehaa\AppData\Local\npm-cache\_logs\2025-05-26T19_40_45_229Z-debug-0.log
PS D:\New folder\OneDrive - Cal Poly\Documents\GitHub\TLA\weblink-dashboard> npm install @speckle/client
npm error code E404
npm error 404 Not Found - GET https://registry.npmjs.org/@speckle%2fclient - Not found
npm error 404
npm error 404  '@speckle/client@*' is not in this registry.
npm error 404
npm error 404 Note that you can also install from a
npm error 404 tarball, folder, http url, or git url.
npm error A complete log of this run can be found in: C:\Users\nehaa\AppData\Local\npm-cache\_logs\2025-05-26T19_48_11_623Z-debug-0.log


Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm cache clean --force


+-- @vitejs/plugin-react@4.5.0
+-- autoprefixer@10.4.21
+-- framer-motion@12.14.0
+-- postcss@8.5.3
+-- react-dom@18.3.1
+-- react@18.3.1
+-- tailwindcss@3.4.17
`-- vite@6.3.5
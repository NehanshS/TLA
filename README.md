# TLA
WEB APP


To set up your **Vite project** for your **Weblink Dashboard** (with **Tailwind CSS**), here's the **clean, structured setup** you can follow step by step. This guide assumes your dashboard is a front-end React app with a cyberpunk/Cybertruck style and you'll later embed Speckle's 3D viewer.

---

## 🔧 1. Create a Vite + React Project

Open terminal in the directory where you want to create your project and run:

```bash
npm create vite@latest weblink-dashboard --template react
cd weblink-dashboard
```

This scaffolds a new project with Vite + React.

---

## 📦 2. Install Dependencies

Run:

```bash
npm install
```

Then install **Tailwind CSS** and related dependencies:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

This creates two config files:

* `tailwind.config.js`
* `postcss.config.js`

---

## 🎨 3. Configure Tailwind

Edit `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

In `src/index.css` (or create it if missing), add:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Then import it in `src/main.jsx`:

```jsx
import './index.css';
```

---

## 🗂 4. Project Folder Structure (Customize for Weblink)

You can organize like this:

```
weblink-dashboard/
├── public/
│   └── speckle-embed.html (optional)
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── DonutChart.jsx
│   │   └── WorksetDial.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── tailwind.config.js
├── index.html
└── vite.config.js
```

---

## 🧪 5. Run Your Dev Server

```bash
npm run dev
```

You'll see your project live at `http://localhost:5173`.

---

## 🌐 6. (Optional) Deploy on Vercel or Netlify

When ready:

```bash
npm run build
```

Then push to GitHub and connect your repo to [Vercel](https://vercel.com) or [Netlify](https://netlify.com) for seamless hosting.

---

## 🔌 7. Speckle Viewer Embedding

Later on, you’ll add a Speckle embed in one of your components. For example, in `SpeckleViewer.jsx`:

```jsx
import React, { useEffect } from 'react';

const SpeckleViewer = ({ streamId }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.speckle.dev/embed.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <iframe
      style={{ width: '100%', height: '100%' }}
      src={`https://speckle.xyz/embed?stream=${streamId}&embed=true`}
      frameBorder="0"
      allowFullScreen
    />
  );
};

export default SpeckleViewer;
```

---

## ✅ Next Steps for You

* Create `Dashboard.jsx` and style it with Tailwind using your cyberpunk-inspired layout
* Use `DonutChart.jsx` and `WorksetDial.jsx` as individual components
* Bring in mock data first, and later hook it with Speckle stream or Revit-generated JSON

Let me know if you want me to **generate a starter repo**, prebuilt components, or a live preview scaffold.

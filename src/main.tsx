import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { fetchDashboardConfig } from './utils/dashboardConfig'

// Hydrate shared dashboard config from backend, then render.
// On failure, render with cached/default config.
fetchDashboardConfig().finally(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});

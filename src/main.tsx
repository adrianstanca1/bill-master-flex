import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { applyUserTheme } from './lib/theme'

applyUserTheme();

createRoot(document.getElementById("root")!).render(<App />);

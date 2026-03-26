import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**2. La structure de ton repo est exactement :**
```
/
├── vite.config.js
├── package.json
├── index.html
└── src/
    ├── main.jsx
    └── App.jsx

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

Ta structure doit être exactement :
```
flowboard/
├── vite.config.js   ← à ajouter
├── package.json
├── index.html
└── src/
    ├── main.jsx
    └── App.jsx

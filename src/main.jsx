import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```
- Clique **"Commit changes"**

---

**Étape 2 — Crée `src/App.jsx`**
- Clique sur **"Add file"** → **"Create new file"**
- Dans la case du nom, tape exactement : `src/App.jsx`
- Colle tout le contenu du fichier App.jsx (celui téléchargé plus tôt)
- Clique **"Commit changes"**

---

**Étape 3 — Supprime les anciens fichiers à la racine**
- Clique sur `App.jsx` à la racine → icône poubelle → **"Commit changes"**
- Clique sur `main.jsx` à la racine → icône poubelle → **"Commit changes"**

---

À la fin tu dois voir exactement ça sur GitHub :
```
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx
    └── main.jsx

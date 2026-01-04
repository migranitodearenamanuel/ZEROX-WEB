# ZEROX Web Dossier

Este repositorio (`zerox-web`) contiene el sitio web estático público y el motor de documentación inteligente ("RepoBrain") para el proyecto ZEROX.

## 🧠 Arquitectura
- **Web Estática**: HTML5/CSS/JS (Sin frameworks).
- **RepoBrain**: Motor RAG offline que indexa código.
  - **Indexador**: `tools/scan_repo.py` (Lee `../zerox-core`).
  - **Base de Conocimiento**: `assets/knowledge/*.json`.
  - **Motor**: `assets/js/repobrain.js` (Ejecuta en el navegador).

## 🚀 Despliegue (GitHub Pages)
El sitio está configurado para desplegarse automáticamente desde la rama `main` a la raíz de `gh-pages` usando GitHub Actions.

### Cómo Publicar
1. Realiza cambios en `index.html`, `style.css`, etc.
2. Si actualizas el código del núcleo (`zerox-core`), regenera la base de conocimiento:
   ```bash
   # Desde la raíz de zerox-web
   python tools/scan_repo.py
   ```
3. Sube los cambios:
   ```bash
   git add .
   git commit -m "Update site"
   git push
   ```
4. El Action `.github/workflows/deploy.yml` publicará el sitio en:
   `https://migranitodearenamanuel.github.io/zerox-web/`

## 🛠️ Desarrollo Local
```bash
python -m http.server
# Abre http://localhost:8000
```

## 🔍 SEO & Marca
- **Color**: Rojo ZEROX (`#ff3333`) y Azul Profundo (`#2b59ff`).
- **Sitemap**: `sitemap.xml`
- **Robots**: `robots.txt`

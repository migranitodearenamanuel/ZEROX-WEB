# ZEROX-WEB 🧠🤖

> **Tu asistente de IA personal ejecutándose localmente en el navegador.**

ZEROX-WEB es una aplicación web estática revolucionaria que aloja un Modelo de Lenguaje Grande (LLM) completo directamente en el lado del cliente. Utilizando **WebLLM** y el modelo **Phi-3 Mini 4k**, Zerox funciona sin enviar tus datos a servidores externos, garantizando privacidad y velocidad tras la carga inicial.

![Status](https://img.shields.io/badge/Status-Active-success)
![AI Engine](https://img.shields.io/badge/AI-WebLLM%20%2F%20Phi--3-blueviolet)
![Privacy](https://img.shields.io/badge/Privacy-Local%20Inference-green)

---

## 🚀 Características Principales

-   **IA 100% en el Navegador**: Utiliza la tecnología WebGPU para ejecutar el modelo `Phi-3-mini-4k-instruct` directamente en tu tarjeta gráfica, sin necesidad de backend Python.
-   **Interfaz Terminal Retro**: Una experiencia de usuario inmersiva estilo "hacker" con efectos de partículas y línea de comandos.
-   **Base de Conocimiento Propia (RAG Lite)**: El sistema `repobrain.js` carga conocimientos personalizados desde JSON (`assets/knowledge/`), permitiendo que la IA responda preguntas específicas sobre tu identidad o producto.
-   **Multilingüe Nativo**: Soporte completo para Español (`/es`) e Inglés (`/en`) con detección automática y contenido localizado.
-   **PWA Ready**: Incluye `manifest.webmanifest` para poder instalarse como una aplicación nativa en dispositivos móviles y escritorio.

---

## 📂 Estructura del Proyecto

El repositorio está organizado para separar la lógica de IA, el contenido estático y las herramientas de desarrollo:

### 🧠 `assets/brain/`
Contiene los "shards" (fragmentos) del modelo **Phi-3** optimizado para navegadores (formato WebLLM/MLC).
-   `params_shard_*.bin`: Pesos del modelo neuronal.
-   `tokenizer.json`: Reglas para procesar el texto.

### ⚙️ `assets/js/`
El núcleo lógico de la aplicación:
-   `repobrain.js`: Gestiona la carga del modelo IA y la inyección de contexto (Knowledge Base).
-   `terminal.js`: Controla la interfaz de usuario, inputs y outputs de texto.
-   `app.js` & `config.js`: Configuración general y arranque del sistema.

### 🛠 `tools/` (Python Utilities)
Scripts de automatización para mantener el sitio web:
-   `scan_repo.py`: Escanea el proyecto para generar mapas de sitio o actualizar índices.
-   `upgrade_headers.py` / `upgrade_footers.py`: Permite actualizar menús y pies de página en todos los archivos HTML masivamente.
-   `fix_padding.py`: Ajustes automáticos de estilos.

### 🌍 `es/` & `en/`
Las páginas estáticas del sitio web (Inicio, Contacto, Producto, FAQ, Seguridad) divididas por idioma.

---

## 🛠️ Instalación y Despliegue

### Requisitos Previos
-   Un navegador moderno con soporte para **WebGPU** (Chrome 113+, Edge, etc.).
-   GPU con soporte para Vulkan/Metal/DirectX12.

### Ejecución Local
Como es un sitio estático, no necesitas instalar Node.js ni Python para "correrlo", solo un servidor HTTP simple (debido a las políticas de seguridad CORS para cargar los modelos .bin).

1.  Clona el repositorio:
    ```bash
    git clone [https://github.com/migranitodearenamanuel/ZEROX-WEB.git](https://github.com/migranitodearenamanuel/ZEROX-WEB.git)
    cd ZEROX-WEB
    ```
2.  Inicia un servidor local (ejemplo con Python):
    ```bash
    python -m http.server 8000
    ```
3.  Abre `http://localhost:8000` en tu navegador.

### Despliegue en GitHub Pages
Este proyecto incluye un workflow en `.github/workflows/deploy.yml`. Simplemente haz push a la rama `main` y GitHub Actions debería encargarse del resto (asegúrate de habilitar GitHub Pages en la configuración del repo para servir desde `gh-pages` o desde el workflow).

---

## 🤖 Cómo funciona el "Cerebro" (RepoBrain)

1.  **Carga**: Al entrar, `repobrain.js` descarga y cachea el modelo Phi-3 (aprox. 2GB) en el navegador del usuario.
2.  **Contexto**: Lee los archivos `assets/knowledge/kb_es.json` (o `_en.json`).
3.  **Inferencia**: Cuando el usuario escribe en la terminal, el sistema combina la pregunta con el contexto base y la envía al modelo local para generar la respuesta.

---

## 📈 Marketing y SEO
La carpeta `marketing/` contiene la estrategia de crecimiento del proyecto:
-   Planes de Google Ads (`google-ads-plan-*.md`).
-   Listas de palabras clave negativas y ejemplos de UTMs para seguimiento de campañas.

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia MIT. Eres libre de usarlo, modificarlo y distribuirlo.
*Los pesos del modelo Phi-3 están sujetos a la licencia de Microsoft.*

---
<p align="center">
  Hecho con ❤️ y ☕ por Manuel
</p>

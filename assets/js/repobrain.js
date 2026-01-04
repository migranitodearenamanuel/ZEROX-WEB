
import { CreateMLCEngine } from "https://esm.run/@mlc-ai/web-llm";
import { pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.16.0";

/**
 * REPOBRAIN 6.0 - SEMANTIC NEURAL CORE
 * 
 * [ES] Arquitectura:
 * - V4: Keyword Search (Instantáneo).
 * - V6: Semantic Search (Vectores) -> Encuentra significado, no solo palabras.
 * - V5: LLM (Phi-3) -> Razonamiento sobre el contexto encontrado.
 * 
 * [EN] Architecture:
 * - V4: Keyword Search (Instant).
 * - V6: Semantic Search (Vectors) -> Finds meaning, not just words.
 * - V5: LLM (Phi-3) -> Reasoning upon retrieved context.
 */

const LOCAL_MODEL_ID = "Phi-3-mini-4k-instruct-q4f16_1-MLC";
const APP_CONFIG = {
    model_list: [
        {
            "model": "https://huggingface.co/mlc-ai/Phi-3-mini-4k-instruct-q4f16_1-MLC",
            "model_id": LOCAL_MODEL_ID,
            "model_lib": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/phi-3-mini-4k-instruct-q4f16_1-webgpu.wasm",
            "model_url": "../assets/brain/Phi-3-mini-4k-instruct-q4f16_1-MLC/"
        }
    ],
    useIndexedDBCache: true
};

const CONTEXTS = {
    es: `Eres ZEROX, una IA ingeniera.
    CONOCIMIENTO: Código fuente de un sistema de trading algorítmico (Python).
    MISIÓN: Ayudar a desarrolladores a entender el código.`,
    en: `You are ZEROX, an engineering AI.
    KNOWLEDGE: Source code of an algo-trading system (Python).
    MISSION: Help developers understand the code.`
};

class RepoBrain {
    constructor() {
        this.kb = [];
        this.index = {};
        this.vectors = {}; // [ES] Mapa de vectores (ID -> Array)
        this.isLoaded = false;

        this.neuralEngine = null;
        this.neuralReady = false;

        // [ES] Modelo NLP pequeño para el navegador (embedding de queries)
        this.extractor = null;

        this.init();
        this.bootNeuralLocal();
        this.initSemantic();
    }

    async init() {
        try {
            const lang = CONFIG.DEFAULT_LANG || 'es';
            const v = new Date().getTime();

            // [ES] Cargar KB, Indice y Vectores
            const [kbData, indexData, vectorData] = await Promise.all([
                fetch(`../assets/knowledge/kb_${lang}.json?v=${v}`).then(r => r.json()),
                fetch(`../assets/knowledge/index_${lang}.json?v=${v}`).then(r => r.json()),
                fetch(`../assets/knowledge/vectors.json?v=${v}`).then(r => r.json().catch(() => null)) // Catch si no existe
            ]);

            this.kb = kbData;
            this.index = indexData;
            this.vectors = vectorData || {};
            this.isLoaded = true;
            console.log("[RepoBrain] Knowledge Base Online.");
        } catch (e) {
            console.error("[RepoBrain] Static Init Error:", e);
        }
    }

    async initSemantic() {
        try {
            // [ES] Cargar modelo de embeddings en el navegador
            console.log("[RepoBrain] Loading NLP Extractor...");
            this.extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            console.log("[RepoBrain] Semantic Search Ready.");
        } catch (e) {
            console.warn("[RepoBrain] Semantic NLP Failed:", e);
        }
    }

    async bootNeuralLocal() {
        if (!navigator.gpu) return;
        try {
            this.neuralEngine = await CreateMLCEngine(LOCAL_MODEL_ID, {
                appConfig: APP_CONFIG,
                initProgressCallback: (r) => document.dispatchEvent(new CustomEvent('brain-progress', { detail: r }))
            });
            this.neuralReady = true;
            document.dispatchEvent(new CustomEvent('brain-ready'));
        } catch (e) {
            document.dispatchEvent(new CustomEvent('brain-error', { detail: e.message }));
        }
    }

    async process(query, onToken) {
        // Guardrails
        if (CONFIG.FORBIDDEN_TERMS.some(t => query.toLowerCase().includes(t))) return { type: 'rejection', text: "🛑 No financial advice." };

        // [ES] Selección de Estrategia de Búsqueda
        let contextDocs = [];

        // Estrategia 1: Semántica (Si tenemos vectores y extractor)
        if (this.vectors && this.extractor) {
            try {
                contextDocs = await this.searchSemantic(query);
            } catch (e) { console.error(e); }
        }

        // Estrategia 2: Keyword (Fallback o Complemento)
        if (contextDocs.length === 0) {
            contextDocs = this.searchKeyword(query);
        }

        // MODO NEURAL
        if (this.neuralReady && this.neuralEngine) {
            const contextStr = contextDocs.slice(0, 3).map(s => `FILE: ${s.path}\nTEXT: ${s.text.substring(0, 400)}`).join("\n---\n");
            const messages = [
                { role: "system", content: CONTEXTS[CONFIG.DEFAULT_LANG] + "\n\nCONTEXT:\n" + contextStr },
                { role: "user", content: query }
            ];

            const reply = await this.neuralEngine.chat.completions.create({ messages, stream: true });
            let full = "";
            for await (const chunk of reply) {
                const delta = chunk.choices[0]?.delta?.content || "";
                full += delta;
                if (onToken) onToken(full);
            }
            return { type: 'answer', text: full };
        }

        // MODO V4 (Rápido)
        await new Promise(r => setTimeout(r, 100)); // [ES] UX Feeling
        const best = contextDocs[0];
        if (best) {
            return { type: 'answer', text: `### 📄 ${best.title}\n*${best.path}*\n\n> ${best.text.substring(0, 300)}...` };
        }
        return { type: 'answer', text: "No matches found." };
    }

    /* --- SEARCH ENGINES --- */

    searchKeyword(query) {
        if (!this.isLoaded) return [];
        const q = query.toLowerCase().replace(/[^\w\s]/g, '');
        const tokens = q.split(/\s+/).filter(t => t.length > 2);
        const candidates = new Set();
        tokens.forEach(t => { if (this.index[t]) this.index[t].forEach(id => candidates.add(id)); });
        return Array.from(candidates).map(id => {
            const doc = this.kb[id];
            let score = 0;
            if (doc.title.toLowerCase().includes(q)) score += 50;
            tokens.forEach(t => { if (doc.text.toLowerCase().includes(t)) score += 10; });
            return { doc, score };
        }).sort((a, b) => b.score - a.score).map(s => s.doc);
    }

    async searchSemantic(query) {
        // [ES] Generar vector de la pregunta
        const output = await this.extractor(query, { pooling: 'mean', normalize: true });
        const queryVec = output.data;

        // [ES] Comparar con todos los vectores del KB
        const scores = [];
        for (const [id, vec] of Object.entries(this.vectors)) {
            const score = this.cosineSimilarity(queryVec, vec);
            scores.push({ id, score });
        }

        // [ES] Ordenar
        return scores.sort((a, b) => b.score - a.score)
            .filter(s => s.score > 0.3) // Umbral mínimo de relevancia
            .slice(0, 5)
            .map(s => this.kb[s.id]);
    }

    cosineSimilarity(a, b) {
        let dot = 0;
        let magA = 0;
        let magB = 0;
        for (let i = 0; i < a.length; i++) {
            dot += a[i] * b[i];
            magA += a[i] * a[i];
            magB += b[i] * b[i];
        }
        return dot / (Math.sqrt(magA) * Math.sqrt(magB));
    }
}

window.RepoBrain = RepoBrain;
window.botEngine = new RepoBrain();

/**
 * ZEROX Red Neuronal de Fondo
 * Animación de alto rendimiento en Canvas
 */
class NeuralNetwork {
    constructor(canvas) {
        this.c = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.w = 0;
        this.h = 0;

        this.resize();
        this.init();

        window.addEventListener('resize', () => this.resize());
        requestAnimationFrame(() => this.animate());
    }

    resize() {
        this.w = this.c.width = window.innerWidth;
        this.h = this.c.height = window.innerHeight;
        this.init(); // re-init nodes on resize
    }

    init() {
        this.nodes = [];
        const count = Math.floor((this.w * this.h) / 12000); // Higher Density (More particles)
        for (let i = 0; i < count; i++) {
            this.nodes.push({
                x: Math.random() * this.w,
                y: Math.random() * this.h,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() > 0.9 ? 2 : 1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.w, this.h);

        // Draw Nodes
        this.ctx.fillStyle = '#ff3333';
        this.ctx.strokeStyle = '#ff3333';

        for (let i = 0; i < this.nodes.length; i++) {
            const n = this.nodes[i];

            // Move
            n.x += n.vx;
            n.y += n.vy;

            // Bounce
            if (n.x < 0 || n.x > this.w) n.vx *= -1;
            if (n.y < 0 || n.y > this.h) n.vy *= -1;

            // Draw Point
            this.ctx.globalAlpha = Math.random() * 0.5 + 0.2;
            this.ctx.beginPath();
            this.ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Connect
            for (let j = i + 1; j < this.nodes.length; j++) {
                const n2 = this.nodes[j];
                const dx = n.x - n2.x;
                const dy = n.y - n2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    this.ctx.globalAlpha = 1 - (dist / 150);
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(n.x, n.y);
                    this.ctx.lineTo(n2.x, n2.y);
                    this.ctx.stroke();
                }
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('neural-bg');
    if (canvas) new NeuralNetwork(canvas);
});

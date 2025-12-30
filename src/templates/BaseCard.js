import { Canvas, Image } from '@napi-rs/canvas';
import { themeManager } from '../themes/ThemeManager.js';
import { fontRegistry } from '../core/FontRegistry.js';
import { loadImage } from '../core/AssetLoader.js';

export class BaseCard {
    constructor(width = 934, height = 282) {
        this.width = width;
        this.height = height;
        this.theme = themeManager.get('dark'); // Default
        this.ctx = null;
        this.canvas = null;
    }

    /**
     * Set the theme by name or object
     * @param {string|object} theme 
     */
    setTheme(theme) {
        if (typeof theme === 'string') {
            this.theme = themeManager.get(theme);
        } else {
            this.theme = theme;
        }
        return this;
    }

    /**
     * Initialize the canvas context
     */
    _initCanvas() {
        this.canvas = new Canvas(this.width, this.height);
        this.ctx = this.canvas.getContext('2d');

        // Ensure font is loaded
        // In a real app we might ship Roboto, but assuming user provides it or we load default
        if (this.theme.font) {
            // Check if it's a known font path or just a family name hoping it's there
            // fontRegistry.load(...) - would need paths mapped to names.
            // For now we assume the font family is available if registered externally
        }
    }

    /**
     * Draw a rounded rectangle
     */
    drawRoundedRect(x, y, w, h, radius) {
        if (!this.ctx) return;
        const ctx = this.ctx;
        if (w < 2 * radius) radius = w / 2;
        if (h < 2 * radius) radius = h / 2;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + w, y, x + w, y + h, radius);
        ctx.arcTo(x + w, y + h, x, y + h, radius);
        ctx.arcTo(x, y + h, x, y, radius);
        ctx.arcTo(x, y, x + w, y, radius);
        ctx.closePath();
    }

    /**
     * Helper to load and draw an image with optional circular clip
     */
    async drawImage(url, x, y, w, h, circular = false) {
        if (!url) return;
        const buffer = await loadImage(url);
        if (!buffer) return;

        const img = new Image();
        img.src = buffer;

        this.ctx.save();
        if (circular) {
            this.ctx.beginPath();
            this.ctx.arc(x + w / 2, y + h / 2, w / 2, 0, Math.PI * 2);
            this.ctx.closePath();
            this.ctx.clip();
        }
        this.ctx.drawImage(img, x, y, w, h);
        this.ctx.restore();
    }

    /**
     * To be implemented by subclasses
     */
    async render() {
        throw new Error("Method 'render()' must be implemented.");
    }
}

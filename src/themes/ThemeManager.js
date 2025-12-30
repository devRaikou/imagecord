import { themes } from './presets.js';

class ThemeManager {
    constructor() {
        this.themes = new Map(Object.entries(themes));
    }

    /**
     * Get a theme by name
     * @param {string} name 
     * @returns {import('./presets.js').Theme}
     */
    get(name) {
        if (!this.themes.has(name)) {
            throw new Error(`Theme '${name}' not found. Available: ${Array.from(this.themes.keys()).join(', ')}`);
        }
        return this.themes.get(name);
    }

    /**
     * Register a custom theme
     * @param {string} name 
     * @param {import('./presets.js').Theme} themeData 
     */
    register(name, themeData) {
        // Validation could go here
        this.themes.set(name, themeData);
    }
}

export const themeManager = new ThemeManager();

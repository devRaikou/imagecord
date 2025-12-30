import { GlobalFonts } from '@napi-rs/canvas';
import fs from 'fs';
import path from 'path';

class FontRegistry {
    constructor() {
        this.loaded = new Set();
    }

    /**
     * Loads a font from the filesystem if not already loaded.
     * @param {string} fontPath - Absolute path or relative to CWD
     * @param {string} familyName - Font family name
     */
    load(fontPath, familyName) {
        if (this.loaded.has(familyName)) return;

        try {
            // Ensure we resolve the path correctly
            const resolvedPath = path.resolve(process.cwd(), fontPath);

            if (fs.existsSync(resolvedPath)) {
                GlobalFonts.registerFromPath(resolvedPath, familyName);
                this.loaded.add(familyName);
            } else {
                // Warning only, don't crash
                console.warn(`[ImageCord] Font file not found at: ${resolvedPath}`);
            }
        } catch (e) {
            console.error(`[ImageCord] Failed to register font ${familyName}:`, e);
        }
    }
}

export const fontRegistry = new FontRegistry();

/**
 * @typedef {Object} ThemeColors
 * @property {string} background - Main background color
 * @property {string} overlay - Semi-transparent overlay for readability
 * @property {string} primary - Primary accent color
 * @property {string} secondary - Secondary accent color
 * @property {string} text - Main text color
 * @property {string} subtext - Subtitle/detail text color
 * @property {string} progressBackground - Empty state of progress bars
 */

/**
 * @typedef {Object} Theme
 * @property {ThemeColors} colors
 * @property {string} font - Primary font family
 */

export const themes = {
    dark: {
        colors: {
            background: "#23272A",
            overlay: "rgba(0, 0, 0, 0.4)",
            primary: "#5865F2",
            secondary: "#4752C4",
            text: "#FFFFFF",
            subtext: "#B9BBBE",
            progressBackground: "#2F3136"
        },
        font: "Roboto"
    },
    "dark-orange": {
        colors: {
            background: "#121212",
            overlay: "rgba(30, 10, 0, 0.5)",
            primary: "#FF9800",
            secondary: "#F57C00",
            text: "#FFF3E0",
            subtext: "#FFCC80",
            progressBackground: "#3E2723"
        },
        font: "Roboto"
    },
    cyber: {
        colors: {
            background: "#090909",
            overlay: "rgba(0, 255, 234, 0.1)",
            primary: "#00FFEA",
            secondary: "#FF0055",
            text: "#E0F7FA",
            subtext: "#80DEEA",
            progressBackground: "#1A2626"
        },
        font: "Roboto"
    },
    glass: {
        colors: {
            background: "rgba(255, 255, 255, 0.1)", // Needs a background image to really pop
            overlay: "rgba(255, 255, 255, 0.05)",
            primary: "#FFFFFF",
            secondary: "rgba(255, 255, 255, 0.5)",
            text: "#FFFFFF",
            subtext: "rgba(255, 255, 255, 0.8)",
            progressBackground: "rgba(0, 0, 0, 0.3)"
        },
        font: "Roboto"
    }
};
